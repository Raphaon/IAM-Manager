"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const NodeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['organization', 'branch', 'subbranch', 'department', 'team']
    },
    parentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Node',
        default: null
    },
    ancestors: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Node'
        }
    ],
    path: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    metadata: {
        type: Object,
        default: {}
    }
}, { timestamps: true });
NodeSchema.index({ parentId: 1 });
NodeSchema.index({ ancestors: 1 });
exports.Node = mongoose_1.default.model('Node', NodeSchema);
