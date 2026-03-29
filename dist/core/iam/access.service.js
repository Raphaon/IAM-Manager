"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const membership_model_1 = require("../../modules/memberships/membership.model");
const node_model_1 = require("../../modules/nodes/node.model");
const AppError_1 = require("../../shared/errors/AppError");
const permission_service_1 = require("./permission.service");
const policy_service_1 = require("../../modules/policies/policy.service");
const policy_engine_1 = require("./policy.engine");
class AccessService {
    static async can(input) {
        const { userId, systemRole, action, resource, nodeId, resourceData } = input;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new AppError_1.AppError('Invalid userId', 400);
        }
        // 1. bypass global
        if (systemRole === 'admin') {
            return true;
        }
        // 2. memberships actifs
        const memberships = await membership_model_1.Membership.find({
            userId,
            status: 'active'
        });
        if (!memberships.length) {
            return false;
        }
        const roleIds = memberships.map((m) => String(m.roleId));
        const membershipNodeIds = memberships.map((m) => String(m.nodeId));
        // 3. RBAC de base
        let rbacAllowed = false;
        if (!nodeId) {
            for (const membership of memberships) {
                const hasPermission = await permission_service_1.IAMPermissionService.roleHasPermission(String(membership.roleId), resource, action);
                if (hasPermission) {
                    rbacAllowed = true;
                    break;
                }
            }
        }
        else {
            if (!mongoose_1.default.Types.ObjectId.isValid(nodeId)) {
                throw new AppError_1.AppError('Invalid nodeId', 400);
            }
            const targetNode = await node_model_1.Node.findById(nodeId);
            if (!targetNode) {
                throw new AppError_1.AppError('Target node not found', 404);
            }
            const targetNodeId = String(targetNode._id);
            const targetAncestors = (targetNode.ancestors || []).map(String);
            for (const membership of memberships) {
                const hasPermission = await permission_service_1.IAMPermissionService.roleHasPermission(String(membership.roleId), resource, action);
                if (!hasPermission) {
                    continue;
                }
                const membershipNodeId = String(membership.nodeId);
                if (membershipNodeId === targetNodeId) {
                    rbacAllowed = true;
                    break;
                }
                if (membership.inheritsToDescendants &&
                    targetAncestors.includes(membershipNodeId)) {
                    rbacAllowed = true;
                    break;
                }
            }
        }
        if (!rbacAllowed) {
            return false;
        }
        // 4. récupérer les policies applicables
        const applicablePolicies = await policy_service_1.PolicyService.findApplicable({
            resource,
            action,
            userId,
            roleIds,
            nodeIds: membershipNodeIds
        });
        // 5. s'il n'y a pas de policies, RBAC suffit
        if (!applicablePolicies.length) {
            return true;
        }
        // 6. calcul du contexte d'évaluation
        let targetNodeAncestors = [];
        if (nodeId && mongoose_1.default.Types.ObjectId.isValid(nodeId)) {
            const targetNode = await node_model_1.Node.findById(nodeId);
            if (targetNode) {
                targetNodeAncestors = (targetNode.ancestors || []).map(String);
            }
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
        // 7. deny > allow
        let hasAllow = false;
        for (const policy of applicablePolicies) {
            const matches = policy_engine_1.PolicyEngine.evaluate(policy.conditions, evaluationContext);
            if (!matches) {
                continue;
            }
            if (policy.effect === 'deny') {
                return false;
            }
            if (policy.effect === 'allow') {
                hasAllow = true;
            }
        }
        return hasAllow;
    }
}
exports.AccessService = AccessService;
