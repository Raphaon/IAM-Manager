"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const policy_model_1 = require("./policy.model");
const AppError_1 = require("../../shared/errors/AppError");
class PolicyService {
    static async create(data) {
        if (!data.name?.trim()) {
            throw new AppError_1.AppError('Policy name is required', 400);
        }
        if (!data.resource?.trim()) {
            throw new AppError_1.AppError('Policy resource is required', 400);
        }
        if (!data.action?.trim()) {
            throw new AppError_1.AppError('Policy action is required', 400);
        }
        if (!data.conditions || typeof data.conditions !== 'object') {
            throw new AppError_1.AppError('Policy conditions are required', 400);
        }
        const roleIds = data.appliesTo?.roleIds ?? [];
        const userIds = data.appliesTo?.userIds ?? [];
        const nodeIds = data.appliesTo?.nodeIds ?? [];
        for (const id of [...roleIds, ...userIds, ...nodeIds]) {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(`Invalid appliesTo id: ${id}`, 400);
            }
        }
        return policy_model_1.Policy.create({
            name: data.name.trim(),
            description: data.description?.trim(),
            effect: data.effect,
            resource: data.resource.trim().toLowerCase(),
            action: data.action.trim().toLowerCase(),
            scope: data.scope ?? 'global',
            appliesTo: {
                roleIds,
                userIds,
                nodeIds
            },
            conditions: data.conditions,
            isActive: true
        });
    }
    static async findAll() {
        return policy_model_1.Policy.find()
            .populate('appliesTo.roleIds')
            .populate('appliesTo.userIds', '-passwordHash')
            .populate('appliesTo.nodeIds')
            .sort({ priority: -1, createdAt: -1 });
    }
    static async findById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new AppError_1.AppError('Invalid policy id', 400);
        }
        const policy = await policy_model_1.Policy.findById(id)
            .populate('appliesTo.roleIds')
            .populate('appliesTo.userIds', '-passwordHash')
            .populate('appliesTo.nodeIds');
        if (!policy) {
            throw new AppError_1.AppError('Policy not found', 404);
        }
        return policy;
    }
    static async findApplicable(params) {
        const { resource, action, userId, roleIds, nodeIds } = params;
        return policy_model_1.Policy.find({
            isActive: true,
            resource: resource.toLowerCase(),
            action: action.toLowerCase(),
            $or: [
                { 'appliesTo.userIds': userId },
                { 'appliesTo.roleIds': { $in: roleIds } },
                { 'appliesTo.nodeIds': { $in: nodeIds } },
                {
                    'appliesTo.userIds.0': { $exists: false },
                    'appliesTo.roleIds.0': { $exists: false },
                    'appliesTo.nodeIds.0': { $exists: false }
                }
            ]
        }).sort({ priority: -1, createdAt: -1 });
    }
}
exports.PolicyService = PolicyService;
