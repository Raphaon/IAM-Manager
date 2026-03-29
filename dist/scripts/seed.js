"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const access_service_1 = require("../core/iam/access.service");
const AppError_1 = require("../shared/errors/AppError");
const audit_service_1 = require("../modules/audit/audit.service");
const role_model_1 = require("../modules/roles/role.model");
const permission_model_1 = require("../modules/permissions/permission.model");
const authorize = (action, resource, options) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                throw new AppError_1.AppError('Unauthorized', 401);
            }
            const nodeId = options?.getNodeId ? options.getNodeId(req) : undefined;
            const resourceData = options?.getResourceData
                ? options.getResourceData(req)
                : undefined;
            const allowed = await access_service_1.AccessService.can({
                userId: req.user.userId,
                systemRole: req.user.systemRole,
                action,
                resource,
                nodeId,
                resourceData
            });
            await audit_service_1.AuditService.log({
                userId: req.user.userId,
                action,
                resource,
                resourceId: typeof req.params.id === 'string' ? req.params.id : null,
                nodeId: nodeId ?? null,
                result: allowed ? 'success' : 'denied',
                metadata: {
                    method: req.method,
                    path: req.originalUrl
                }
            });
            if (!allowed) {
                throw new AppError_1.AppError('Forbidden', 403);
            }
            next();
        }
        catch (error) {
            next(error);
        }
        const managerRole = await role_model_1.Role.findOne({ name: 'manager' });
        const managerPermissions = await permission_model_1.Permission.find({
            key: { $in: ['node.read', 'node.create', 'invoice.read', 'invoice.approve'] }
        });
        if (managerRole) {
            managerRole.permissionIds = managerPermissions.map((p) => p._id);
            await managerRole.save();
        }
        const memberRole = await role_model_1.Role.findOne({ name: 'member' });
        const memberPermissions = await permission_model_1.Permission.find({
            key: { $in: ['node.read', 'invoice.read'] }
        });
        if (memberRole) {
            memberRole.permissionIds = memberPermissions.map((p) => p._id);
            await memberRole.save();
        }
    };
};
exports.authorize = authorize;
