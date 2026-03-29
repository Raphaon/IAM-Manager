"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PermissionSchema = new mongoose_1.default.Schema({
    resourceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Resource',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['create', 'read', 'update', 'delete', 'approve']
    },
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });
PermissionSchema.index({ resourceId: 1, action: 1 }, { unique: true });
exports.Permission = mongoose_1.default.model('Permission', PermissionSchema);
