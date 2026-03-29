"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IAMPermissionService = void 0;
const role_model_1 = require("../../modules/roles/role.model");
const AppError_1 = require("../../shared/errors/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
class IAMPermissionService {
    static async roleHasPermission(roleId, resource, action) {
        if (!mongoose_1.default.Types.ObjectId.isValid(roleId)) {
            throw new AppError_1.AppError('Invalid roleId', 400);
        }
        const role = await role_model_1.Role.findById(roleId).populate({
            path: 'permissionIds',
            populate: {
                path: 'resourceId'
            }
        });
        if (!role) {
            throw new AppError_1.AppError('Role not found', 404);
        }
        const permissions = role.permissionIds;
        return permissions.some((permission) => {
            const resourceDoc = permission.resourceId;
            return (permission.action === action &&
                resourceDoc &&
                resourceDoc.name === resource);
        });
    }
}
exports.IAMPermissionService = IAMPermissionService;
