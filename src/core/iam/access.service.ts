import mongoose from 'mongoose'
import { Membership } from '../../modules/memberships/membership.model'
import { Node } from '../../modules/nodes/node.model'
import { AppError } from '../../shared/errors/AppError'
import { IAMPermissionService } from './permission.service'
import { AccessCheckInput } from '../../types/iam.types'
import { PolicyService } from '../../modules/policies/policy.service'
import { PolicyEngine } from './policy.engine'
import { PolicyEvaluationContext } from '../../types/context.types'

export class AccessService {
  static async can(input: AccessCheckInput): Promise<boolean> {
    const { userId, systemRole, action, resource, nodeId, resourceData } = input

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid userId', 400)
    }

    // 1. bypass global
    if (systemRole === 'admin') {
      return true
    }

    // 2. memberships actifs
    const memberships = await Membership.find({
      userId,
      status: 'active'
    })

    if (!memberships.length) {
      return false
    }

    const roleIds = memberships.map((m) => String(m.roleId))
    const membershipNodeIds = memberships.map((m) => String(m.nodeId))

    // 3. RBAC de base
    let rbacAllowed = false

    if (!nodeId) {
      for (const membership of memberships) {
        const hasPermission = await IAMPermissionService.roleHasPermission(
          String(membership.roleId),
          resource,
          action
        )

        if (hasPermission) {
          rbacAllowed = true
          break
        }
      }
    } else {
      if (!mongoose.Types.ObjectId.isValid(nodeId)) {
        throw new AppError('Invalid nodeId', 400)
      }

      const targetNode = await Node.findById(nodeId)
      if (!targetNode) {
        throw new AppError('Target node not found', 404)
      }

      const targetNodeId = String(targetNode._id)
      const targetAncestors = (targetNode.ancestors || []).map(String)

      for (const membership of memberships) {
        const hasPermission = await IAMPermissionService.roleHasPermission(
          String(membership.roleId),
          resource,
          action
        )

        if (!hasPermission) {
          continue
        }

        const membershipNodeId = String(membership.nodeId)

        if (membershipNodeId === targetNodeId) {
          rbacAllowed = true
          break
        }

        if (
          membership.inheritsToDescendants &&
          targetAncestors.includes(membershipNodeId)
        ) {
          rbacAllowed = true
          break
        }
      }
    }

    if (!rbacAllowed) {
      return false
    }

    // 4. récupérer les policies applicables
    const applicablePolicies = await PolicyService.findApplicable({
      resource,
      action,
      userId,
      roleIds,
      nodeIds: membershipNodeIds
    })

    // 5. s'il n'y a pas de policies, RBAC suffit
    if (!applicablePolicies.length) {
      return true
    }

    // 6. calcul du contexte d'évaluation
    let targetNodeAncestors: string[] = []

    if (nodeId && mongoose.Types.ObjectId.isValid(nodeId)) {
      const targetNode = await Node.findById(nodeId)
      if (targetNode) {
        targetNodeAncestors = (targetNode.ancestors || []).map(String)
      }
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

    // 7. deny > allow
    let hasAllow = false

    for (const policy of applicablePolicies) {
      const matches = PolicyEngine.evaluate(
        policy.conditions as any,
        evaluationContext
      )

      if (!matches) {
        continue
      }

      if (policy.effect === 'deny') {
        return false
      }

      if (policy.effect === 'allow') {
        hasAllow = true
      }
    }

    return hasAllow
  }
}