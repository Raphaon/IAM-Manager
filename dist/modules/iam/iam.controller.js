"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IAMController = void 0;
const debug_access_service_1 = require("../../core/iam/debug-access.service");
class IAMController {
    static async debugAccess(req, res, next) {
        try {
            const result = await debug_access_service_1.DebugAccessService.explain(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.IAMController = IAMController;
