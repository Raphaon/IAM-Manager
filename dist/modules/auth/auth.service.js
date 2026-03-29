"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_service_1 = require("../users/user.service");
const AppError_1 = require("../../shared/errors/AppError");
const validators_1 = require("../../shared/utils/validators");
const refresh_token_model_1 = require("./refresh-token.model");
const auth_tokens_1 = require("./auth.tokens");
class AuthService {
    static async register(data) {
        const email = data.email?.toLowerCase().trim();
        if (!email || !(0, validators_1.isValidEmail)(email)) {
            throw new AppError_1.AppError('Invalid email', 400);
        }
        if (!(0, validators_1.isStrongEnoughPassword)(data.password)) {
            throw new AppError_1.AppError('Password must contain at least 6 characters', 400);
        }
        const existingUser = await user_service_1.UserService.findByEmail(email);
        if (existingUser) {
            throw new AppError_1.AppError('User already exists', 409);
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        const user = await user_service_1.UserService.create({
            email,
            passwordHash,
            firstName: data.firstName?.trim(),
            lastName: data.lastName?.trim()
        });
        const payload = {
            userId: String(user._id),
            email: user.email,
            systemRole: user.systemRole
        };
        const accessToken = auth_tokens_1.AuthTokenService.generateAccessToken(payload);
        const refreshToken = auth_tokens_1.AuthTokenService.generateRefreshToken(String(user._id));
        const tokenHash = auth_tokens_1.AuthTokenService.hashToken(refreshToken);
        await refresh_token_model_1.RefreshToken.create({
            userId: user._id,
            tokenHash,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        return {
            user: {
                id: String(user._id),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
                isVerified: user.isVerified,
                systemRole: user.systemRole
            },
            accessToken,
            refreshToken
        };
    }
    static async login(data) {
        const email = data.email?.toLowerCase().trim();
        if (!email || !data.password) {
            throw new AppError_1.AppError('Email and password are required', 400);
        }
        const user = await user_service_1.UserService.findByEmail(email);
        if (!user) {
            throw new AppError_1.AppError('Invalid credentials', 401);
        }
        if (!user.isActive) {
            throw new AppError_1.AppError('User is inactive', 403);
        }
        const isPasswordValid = await bcrypt_1.default.compare(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new AppError_1.AppError('Invalid credentials', 401);
        }
        await user_service_1.UserService.updateLastLogin(String(user._id));
        const payload = {
            userId: String(user._id),
            email: user.email,
            systemRole: user.systemRole
        };
        const accessToken = auth_tokens_1.AuthTokenService.generateAccessToken(payload);
        const refreshToken = auth_tokens_1.AuthTokenService.generateRefreshToken(String(user._id));
        const tokenHash = auth_tokens_1.AuthTokenService.hashToken(refreshToken);
        await refresh_token_model_1.RefreshToken.create({
            userId: user._id,
            tokenHash,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        return {
            user: {
                id: String(user._id),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
                isVerified: user.isVerified,
                systemRole: user.systemRole
            },
            accessToken,
            refreshToken
        };
    }
    static async refresh(data) {
        if (!data.refreshToken) {
            throw new AppError_1.AppError('refreshToken is required', 400);
        }
        const payload = auth_tokens_1.AuthTokenService.verifyRefreshToken(data.refreshToken);
        if (payload.type !== 'refresh') {
            throw new AppError_1.AppError('Invalid refresh token', 401);
        }
        const tokenHash = auth_tokens_1.AuthTokenService.hashToken(data.refreshToken);
        const storedToken = await refresh_token_model_1.RefreshToken.findOne({
            tokenHash,
            revokedAt: null
        });
        if (!storedToken) {
            throw new AppError_1.AppError('Refresh token not found or revoked', 401);
        }
        if (storedToken.expiresAt.getTime() < Date.now()) {
            throw new AppError_1.AppError('Refresh token expired', 401);
        }
        const user = await user_service_1.UserService.findById(payload.userId);
        if (!user || !user.isActive) {
            throw new AppError_1.AppError('User not found or inactive', 401);
        }
        const accessPayload = {
            userId: String(user._id),
            email: user.email,
            systemRole: user.systemRole
        };
        const accessToken = auth_tokens_1.AuthTokenService.generateAccessToken(accessPayload);
        return { accessToken };
    }
    static async logout(data) {
        if (!data.refreshToken) {
            throw new AppError_1.AppError('refreshToken is required', 400);
        }
        const tokenHash = auth_tokens_1.AuthTokenService.hashToken(data.refreshToken);
        await refresh_token_model_1.RefreshToken.findOneAndUpdate({ tokenHash, revokedAt: null }, { revokedAt: new Date() });
        return { message: 'Logged out successfully' };
    }
}
exports.AuthService = AuthService;
