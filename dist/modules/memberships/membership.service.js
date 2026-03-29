"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const membership_model_1 = require("./membership.model");
const user_model_1 = require("../users/user.model");
const node_model_1 = require("../nodes/node.model");
const role_model_1 = require("../roles/role.model");
const AppError_1 = require("../../shared/errors/AppError");
class MembershipService {
    static async create(data) {
        const { userId, nodeId, roleId } = data;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new AppError_1.AppError('Invalid userId', 400);
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(nodeId)) {
            throw new AppError_1.AppError('Invalid nodeId', 400);
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(roleId)) {
            throw new AppError_1.AppError('Invalid roleId', 400);
        }
        const [user, node, role] = await Promise.all([
            user_model_1.User.findById(userId),
            node_model_1.Node.findById(nodeId),
            role_model_1.Role.findById(roleId)
        ]);
        if (!user) {
            throw new AppError_1.AppError('User not found', 404);
        }
        if (!node) {
            throw new AppError_1.AppError('Node not found', 404);
        }
        if (!role) {
            throw new AppError_1.AppError('Role not found', 404);
        }
        const existing = await membership_model_1.Membership.findOne({
            userId,
            nodeId,
            roleId
        });
        if (existing) {
            throw new AppError_1.AppError('Membership already exists', 409);
        }
        return membership_model_1.Membership.create({
            userId,
            nodeId,
            roleId,
            status: data.status ?? 'active',
            inheritsToDescendants: data.inheritsToDescendants ?? true
        });
    }
    static async findAll() {
        return membership_model_1.Membership.find()
            .populate('userId', '-passwordHash')
            .populate('nodeId')
            .populate({
            path: 'roleId',
            populate: {
                path: 'permissionIds',
                populate: { path: 'resourceId' }
            }
        })
            .sort({ createdAt: -1 });
    }
    static async findById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new AppError_1.AppError('Invalid membership id', 400);
        }
        const membership = await membership_model_1.Membership.findById(id)
            .populate('userId', '-passwordHash')
            .populate('nodeId')
            .populate({
            path: 'roleId',
            populate: {
                path: 'permissionIds',
                populate: { path: 'resourceId' }
            }
        });
        if (!membership) {
            throw new AppError_1.AppError('Membership not found', 404);
        }
        return membership;
    }
    static async findByUser(userId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new AppError_1.AppError('Invalid userId', 400);
        }
        return membership_model_1.Membership.find({ userId })
            .populate('nodeId')
            .populate({
            path: 'roleId',
            populate: {
                path: 'permissionIds',
                populate: { path: 'resourceId' }
            }
        })
            .sort({ createdAt: -1 });
    }
    static async findByNode(nodeId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(nodeId)) {
            throw new AppError_1.AppError('Invalid nodeId', 400);
        }
        return membership_model_1.Membership.find({ nodeId })
            .populate('userId', '-passwordHash')
            .populate({
            path: 'roleId',
            populate: {
                path: 'permissionIds',
                populate: { path: 'resourceId' }
            }
        })
            .sort({ createdAt: -1 });
    }
}
exports.MembershipService = MembershipService;
