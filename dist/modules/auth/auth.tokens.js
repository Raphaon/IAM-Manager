"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const app_config_1 = require("../../config/app.config");
class AuthTokenService {
    static generateAccessToken(payload) {
        const options = {
            expiresIn: app_config_1.appConfig.jwtExpiresIn
        };
        return jsonwebtoken_1.default.sign(payload, app_config_1.appConfig.jwtSecret, options);
    }
    static generateRefreshToken(userId) {
        const payload = {
            userId,
            type: 'refresh'
        };
        const options = {
            expiresIn: app_config_1.appConfig.jwtRefreshExpiresIn
        };
        return jsonwebtoken_1.default.sign(payload, app_config_1.appConfig.jwtRefreshSecret, options);
    }
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, app_config_1.appConfig.jwtRefreshSecret);
    }
    static hashToken(token) {
        return crypto_1.default.createHash('sha256').update(token).digest('hex');
    }
}
exports.AuthTokenService = AuthTokenService;
