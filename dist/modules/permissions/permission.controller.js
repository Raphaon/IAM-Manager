"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionController = void 0;
const permission_service_1 = require("./permission.service");
class PermissionController {
    static async create(req, res, next) {
        try {
            const permission = await permission_service_1.PermissionService.create(req.body);
            res.status(201).json(permission);
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const permissions = await permission_service_1.PermissionService.findAll();
            res.status(200).json(permissions);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PermissionController = PermissionController;
