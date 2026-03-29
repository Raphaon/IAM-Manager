"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const role_service_1 = require("./role.service");
class RoleController {
    static async create(req, res, next) {
        try {
            const role = await role_service_1.RoleService.create(req.body);
            res.status(201).json(role);
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const roles = await role_service_1.RoleService.findAll();
            res.status(200).json(roles);
        }
        catch (error) {
            next(error);
        }
    }
    static async addPermission(req, res, next) {
        const roleId = String(req.params.roleId);
        const permissionId = String(req.params.permissionId);
        try {
            const role = await role_service_1.RoleService.addPermission(roleId, permissionId);
            res.status(200).json(role);
        }
        catch (error) {
            next(error);
        }
    }
    static async getPermissions(req, res, next) {
        try {
            const roleId = String(req.params.roleId);
            const permissions = await role_service_1.RoleService.getPermissions(roleId);
            res.status(200).json(permissions);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.RoleController = RoleController;
