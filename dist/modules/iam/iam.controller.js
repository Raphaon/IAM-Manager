"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IAMController = void 0;
const debug_access_service_1 = require("../../core/iam/debug-access.service");
class IAMController {
    static async debugAccess(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const isAdmin = req.user.systemRole === 'admin';
            const targetUserId = isAdmin && typeof req.body.userId === 'string'
                ? req.body.userId
                : req.user.userId;
            const input = {
                userId: targetUserId,
                systemRole: req.user.systemRole,
                resource: typeof req.body.resource === 'string' ? req.body.resource : undefined,
                action: typeof req.body.action === 'string' ? req.body.action : undefined,
                nodeId: typeof req.body.nodeId === 'string' ? req.body.nodeId : undefined,
                resourceData: req.body.resourceData && typeof req.body.resourceData === 'object'
                    ? req.body.resourceData
                    : undefined,
            };
            const result = await debug_access_service_1.DebugAccessService.explain(input);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.IAMController = IAMController;
