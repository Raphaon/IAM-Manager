"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RoleSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true
    },
    isSystem: {
        type: Boolean,
        default: false
    },
    permissionIds: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Permission'
        }
    ]
}, { timestamps: true });
exports.Role = mongoose_1.default.model('Role', RoleSchema);
