"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RefreshTokenSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tokenHash: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    revokedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.RefreshToken = mongoose_1.default.model('RefreshToken', RefreshTokenSchema);
