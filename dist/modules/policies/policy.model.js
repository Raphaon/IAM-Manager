"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Policy = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PolicySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    effect: {
        type: String,
        required: true,
        enum: ['allow', 'deny']
    },
    resource: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    action: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    scope: {
        type: String,
        enum: ['global', 'node', 'descendants', 'self'],
        default: 'global'
    },
    appliesTo: {
        roleIds: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Role'
            }
        ],
        userIds: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        nodeIds: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Node'
            }
        ]
    },
    conditions: {
        type: Object,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    priority: {
        type: Number,
        default: 100
    }
}, { timestamps: true });
PolicySchema.index({ resource: 1, action: 1, isActive: 1 });
exports.Policy = mongoose_1.default.model('Policy', PolicySchema);
