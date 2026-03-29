"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const mongoose_1 = require("mongoose");
const role_model_1 = require("./role.model");
const AppError_1 = require("../../shared/errors/AppError");
const permission_model_1 = require("../permissions/permission.model");
class RoleService {
    static async create(data) {
        const name = data.name?.trim().toLowerCase();
        if (!name) {
            throw new AppError_1.AppError('Role name is required', 400);
        }
        const existing = await role_model_1.Role.findOne({ name });
        if (existing) {
            throw new AppError_1.AppError('Role already exists', 409);
        }
        return role_model_1.Role.create({
            name,
            description: data.description?.trim()
        });
    }
    static async findAll() {
        return role_model_1.Role.find().sort({ name: 1 });
    }
    static async findById(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new AppError_1.AppError('Invalid id', 400);
        }
        const role = await role_model_1.Role.findById(id);
        if (!role) {
            throw new AppError_1.AppError('Role not found', 404);
        }
        return role;
    }
    static async addPermission(roleId, permissionId) {
        const role = await role_model_1.Role.findById(roleId);
        if (!role) {
            throw new AppError_1.AppError('Role not found', 404);
        }
        const permission = await permission_model_1.Permission.findById(permissionId);
        if (!permission) {
            throw new AppError_1.AppError('Permission not found', 404);
        }
        const alreadyAssigned = role.permissionIds.some((id) => String(id) === String(permissionId));
        if (alreadyAssigned) {
            throw new AppError_1.AppError('Permission already assigned to role', 409);
        }
        role.permissionIds.push(permission._id);
        await role.save();
        return role_model_1.Role.findById(roleId).populate({
            path: 'permissionIds',
            populate: { path: 'resourceId' }
        });
    }
    static async getPermissions(roleId) {
        const role = await role_model_1.Role.findById(roleId).populate({
            path: 'permissionIds',
            populate: { path: 'resourceId' }
        });
        if (!role) {
            throw new AppError_1.AppError('Role not found', 404);
        }
        return role.permissionIds;
    }
}
exports.RoleService = RoleService;
