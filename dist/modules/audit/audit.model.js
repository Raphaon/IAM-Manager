"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AuditLogSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    action: {
        type: String,
        required: true,
        trim: true
    },
    resource: {
        type: String,
        required: true,
        trim: true
    },
    resourceId: {
        type: String,
        default: null
    },
    nodeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Node',
        default: null
    },
    result: {
        type: String,
        enum: ['success', 'denied', 'error'],
        required: true
    },
    metadata: {
        type: Object,
        default: {}
    }
}, { timestamps: true });
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, resource: 1, createdAt: -1 });
exports.AuditLog = mongoose_1.default.model('AuditLog', AuditLogSchema);
