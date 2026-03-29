"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const permission_model_1 = require("./permission.model");
const resource_model_1 = require("../resources/resource.model");
const AppError_1 = require("../../shared/errors/AppError");
class PermissionService {
    static async create(data) {
        if (!mongoose_1.default.Types.ObjectId.isValid(data.resourceId)) {
            throw new AppError_1.AppError('Invalid resourceId', 400);
        }
        const resource = await resource_model_1.Resource.findById(data.resourceId);
        if (!resource) {
            throw new AppError_1.AppError('Resource not found', 404);
        }
        if (!resource.allowedActions.includes(data.action)) {
            throw new AppError_1.AppError('Action is not allowed for this resource', 400);
        }
        const key = `${resource.name}.${data.action}`;
        const existing = await permission_model_1.Permission.findOne({ key });
        if (existing) {
            throw new AppError_1.AppError('Permission already exists', 409);
        }
        return permission_model_1.Permission.create({
            resourceId: resource._id,
            action: data.action,
            key,
            description: data.description?.trim()
        });
    }
    static async findAll() {
        return permission_model_1.Permission.find()
            .populate('resourceId')
            .sort({ key: 1 });
    }
    static async findById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new AppError_1.AppError('Invalid permission id', 400);
        }
        const permission = await permission_model_1.Permission.findById(id).populate('resourceId');
        if (!permission) {
            throw new AppError_1.AppError('Permission not found', 404);
        }
        return permission;
    }
}
exports.PermissionService = PermissionService;
