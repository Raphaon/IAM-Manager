"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const audit_service_1 = require("./audit.service");
class AuditController {
    static async list(req, res, next) {
        try {
            const logs = await audit_service_1.AuditService.findAll(req.query);
            res.status(200).json(logs);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuditController = AuditController;
