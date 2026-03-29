"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Membership = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MembershipSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nodeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Node',
        required: true
    },
    roleId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    inheritsToDescendants: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
MembershipSchema.index({ userId: 1 });
MembershipSchema.index({ nodeId: 1 });
MembershipSchema.index({ roleId: 1 });
MembershipSchema.index({ userId: 1, nodeId: 1, roleId: 1 }, { unique: true });
exports.Membership = mongoose_1.default.model('Membership', MembershipSchema);
