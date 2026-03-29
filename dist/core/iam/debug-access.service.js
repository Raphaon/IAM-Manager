"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugAccessService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const membership_model_1 = require("../../modules/memberships/membership.model");
const node_model_1 = require("../../modules/nodes/node.model");
const policy_service_1 = require("../../modules/policies/policy.service");
const permission_service_1 = require("./permission.service");
const policy_engine_1 = require("./policy.engine");
const AppError_1 = require("../../shared/errors/AppError");
class DebugAccessService {
    static async explain(input) {
        const { userId, systemRole, action, resource, nodeId, resourceData } = input;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new AppError_1.AppError('Invalid userId', 400);
        }
        const result = {
            input,
            systemRoleBypass: false,
            memberships: [],
            permissionChecks: [],
            applicablePolicies: [],
            matchedPolicies: [],
            finalDecision: false
        };
        if (systemRole === 'admin') {
            result.systemRoleBypass = true;
            result.finalDecision = true;
            return result;
        }
        const memberships = await membership_model_1.Membership.find({
            userId,
            status: 'active'
        });
        result.memberships = memberships;
        if (!memberships.length) {
            result.finalDecision = false;
            return result;
        }
        const roleIds = memberships.map((m) => String(m.roleId));
        const membershipNodeIds = memberships.map((m) => String(m.nodeId));
        let targetNode = null;
        let targetNodeAncestors = [];
        if (nodeId) {
            if (!mongoose_1.default.Types.ObjectId.isValid(nodeId)) {
                throw new AppError_1.AppError('Invalid nodeId', 400);
            }
            targetNode = await node_model_1.Node.findById(nodeId);
            if (!targetNode) {
                throw new AppError_1.AppError('Target node not found', 404);
            }
            targetNodeAncestors = (targetNode.ancestors || []).map(String);
        }
        let rbacAllowed = false;
        const permissionChecks = [];
        for (const membership of memberships) {
            const hasPermission = await permission_service_1.IAMPermissionService.roleHasPermission(String(membership.roleId), resource, action);
            let scopeMatch = false;
            if (!nodeId) {
                scopeMatch = hasPermission;
            }
            else {
                const membershipNodeId = String(membership.nodeId);
                const targetNodeId = String(targetNode._id);
                if (membershipNodeId === targetNodeId) {
                    scopeMatch = true;
                }
                if (membership.inheritsToDescendants &&
                    targetNodeAncestors.includes(membershipNodeId)) {
                    scopeMatch = true;
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
            });
            if (hasPermission && scopeMatch) {
                rbacAllowed = true;
            }
        }
        result.permissionChecks = permissionChecks;
        if (!rbacAllowed) {
            result.finalDecision = false;
            return result;
        }
        const applicablePolicies = await policy_service_1.PolicyService.findApplicable({
            resource,
            action,
            userId,
            roleIds,
            nodeIds: membershipNodeIds
        });
        result.applicablePolicies = applicablePolicies;
        if (!applicablePolicies.length) {
            result.finalDecision = true;
            return result;
        }
        const allowedNodeIds = [...new Set([...membershipNodeIds, ...targetNodeAncestors])];
        const evaluationContext = {
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
        };
        const matchedPolicies = [];
        let hasAllow = false;
        for (const policy of applicablePolicies) {
            const matched = policy_engine_1.PolicyEngine.evaluate(policy.conditions, evaluationContext);
            matchedPolicies.push({
                policyId: String(policy._id),
                name: policy.name,
                effect: policy.effect,
                matched
            });
            if (!matched) {
                continue;
            }
            if (policy.effect === 'deny') {
                result.matchedPolicies = matchedPolicies;
                result.finalDecision = false;
                return result;
            }
            if (policy.effect === 'allow') {
                hasAllow = true;
            }
        }
        result.matchedPolicies = matchedPolicies;
        result.finalDecision = hasAllow;
        return result;
    }
}
exports.DebugAccessService = DebugAccessService;
