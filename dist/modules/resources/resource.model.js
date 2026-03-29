"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ResourceSchema = new mongoose_1.default.Schema({
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
    allowedActions: [
        {
            type: String,
            enum: ['create', 'read', 'update', 'delete', 'approve']
        }
    ],
    allowedFields: [
        {
            type: String,
            trim: true
        }
    ]
}, { timestamps: true });
exports.Resource = mongoose_1.default.model('Resource', ResourceSchema);
