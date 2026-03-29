import mongoose from 'mongoose'
import { Membership } from '../../modules/memberships/membership.model'
import { Node } from '../../modules/nodes/node.model'
import { PolicyService } from '../../modules/policies/policy.service'
import { IAMPermissionService } from './permission.service'
import { PolicyEngine } from './policy.engine'
import { AppError } from '../../shared/errors/AppError'
import { AccessCheckInput } from '../../types/iam.types'
import { PolicyEvaluationContext } from '../../types/context.types'

export class DebugAccessService {
  static async explain(input: AccessCheckInput) {
    const { userId, systemRole, action, resource, nodeId, resourceData } = input

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid userId', 400)
    }

    const result: Record<string, unknown> = {
      input,
      systemRoleBypass: false,
      memberships: [],
      permissionChecks: [],
      applicablePolicies: [],
      matchedPolicies: [],
      finalDecision: false
    }

    if (systemRole === 'admin') {
      result.systemRoleBypass = true
      result.finalDecision = true
      return result
    }

    const memberships = await Membership.find({
      userId,
      status: 'active'
    })

    result.memberships = memberships

    if (!memberships.length) {
      result.finalDecision = false
      return result
    }

    const roleIds = memberships.map((m) => String(m.roleId))
    const membershipNodeIds = memberships.map((m) => String(m.nodeId))

    let targetNode = null
    let targetNodeAncestors: string[] = []

    if (nodeId) {
      if (!mongoose.Types.ObjectId.isValid(nodeId)) {
        throw new AppError('Invalid nodeId', 400)
      }

      targetNode = await Node.findById(nodeId)
      if (!targetNode) {
        throw new AppError('Target node not found', 404)
      }

      targetNodeAncestors = (targetNode.ancestors || []).map(String)
    }

    let rbacAllowed = false
    const permissionChecks: Record<string, unknown>[] = []

    for (const membership of memberships) {
      const hasPermission = await IAMPermissionService.roleHasPermission(
        String(membership.roleId),
        resource,
        action
      )

      let scopeMatch = false

      if (!nodeId) {
        scopeMatch = hasPermission
      } else {
        const membershipNodeId = String(membership.nodeId)
        const targetNodeId = String(targetNode!._id)

        if (membershipNodeId === targetNodeId) {
          scopeMatch = true
        }

        if (
          membership.inheritsToDescendants &&
          targetNodeAncestors.includes(membershipNodeId)
        ) {
          scopeMatch = true
        }
      }

      permissionChecks.push({
        membershipId: String(membership._id),
        roleId: String(membership.roleId),
        nodeId: String(membership.nodeId),
        inheritsToDescendants: membership.inheritsToDescendants,
        hasPermission,
        scopeMatch,
        grantedByMembership: hasPermission && scopeMatch
      })

      if (hasPermission && scopeMatch) {
        rbacAllowed = true
      }
    }

    result.permissionChecks = permissionChecks

    if (!rbacAllowed) {
      result.finalDecision = false
      return result
    }

    const applicablePolicies = await PolicyService.findApplicable({
      resource,
      action,
      userId,
      roleIds,
      nodeIds: membershipNodeIds
    })

    result.applicablePolicies = applicablePolicies

    if (!applicablePolicies.length) {
      result.finalDecision = true
      return result
    }

    const allowedNodeIds = [...new Set([...membershipNodeIds, ...targetNodeAncestors])]

    const evaluationContext: PolicyEvaluationContext = {
      user: {
        userId,
        systemRole
      },
      resource: {
        name: resource,
        action,
        nodeId,
        ...(resourceData ?? {})
      },
      context: {
        allowedNodeIds,
        targetNodeAncestors,
        membershipNodeIds
      }
    }

    const matchedPolicies: Record<string, unknown>[] = []
    let hasAllow = false

    for (const policy of applicablePolicies) {
      const matched = PolicyEngine.evaluate(policy.conditions as any, evaluationContext)

      matchedPolicies.push({
        policyId: String(policy._id),
        name: policy.name,
        effect: policy.effect,
        matched
      })

      if (!matched) {
        continue
      }

      if (policy.effect === 'deny') {
        result.matchedPolicies = matchedPolicies
        result.finalDecision = false
        return result
      }

      if (policy.effect === 'allow') {
        hasAllow = true
      }
    }

    result.matchedPolicies = matchedPolicies
    result.finalDecision = hasAllow

    return result
  }
}