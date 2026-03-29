"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceService = void 0;
const mongoose_1 = require("mongoose");
const resource_model_1 = require("./resource.model");
const AppError_1 = require("../../shared/errors/AppError");
class ResourceService {
    static async create(data) {
        const name = data.name?.trim().toLowerCase();
        if (!name) {
            throw new AppError_1.AppError('Resource name is required', 400);
        }
        if (!Array.isArray(data.allowedActions) || data.allowedActions.length === 0) {
            throw new AppError_1.AppError('allowedActions is required', 400);
        }
        const existing = await resource_model_1.Resource.findOne({ name });
        if (existing) {
            throw new AppError_1.AppError('Resource already exists', 409);
        }
        return resource_model_1.Resource.create({
            name,
            description: data.description?.trim(),
            allowedActions: data.allowedActions,
            allowedFields: data.allowedFields ?? []
        });
    }
    static async findAll() {
        return resource_model_1.Resource.find().sort({ name: 1 });
    }
    static async findById(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new AppError_1.AppError('Invalid id', 400);
        }
        const resource = await resource_model_1.Resource.findById(id);
        if (!resource) {
            throw new AppError_1.AppError('Resource not found', 404);
        }
        return resource;
    }
}
exports.ResourceService = ResourceService;
