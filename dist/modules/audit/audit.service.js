"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const audit_model_1 = require("./audit.model");
class AuditService {
    static async log(input) {
        return audit_model_1.AuditLog.create({
            userId: input.userId ?? null,
            action: input.action,
            resource: input.resource,
            resourceId: input.resourceId ?? null,
            nodeId: input.nodeId ?? null,
            result: input.result,
            metadata: input.metadata ?? {}
        });
    }
    static async findAll(query) {
        const { getPagination } = await Promise.resolve().then(() => __importStar(require('../../shared/utils/pagination')));
        const { page, limit, skip } = getPagination(query ?? {}, 20, 100);
        const [items, total] = await Promise.all([
            audit_model_1.AuditLog.find()
                .populate('userId', '-passwordHash')
                .populate('nodeId')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            audit_model_1.AuditLog.countDocuments()
        ]);
        return {
            items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
}
exports.AuditService = AuditService;
