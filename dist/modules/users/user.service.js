"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = require("./user.model");
const AppError_1 = require("../../shared/errors/AppError");
class UserService {
    static async findByEmail(email) {
        return user_model_1.User.findOne({ email: email.toLowerCase().trim() });
    }
    static async findById(userId) {
        return user_model_1.User.findById(userId);
    }
    static async create(data) {
        return user_model_1.User.create({
            email: data.email.toLowerCase().trim(),
            passwordHash: data.passwordHash,
            firstName: data.firstName,
            lastName: data.lastName
        });
    }
    static async updateLastLogin(userId) {
        return user_model_1.User.findByIdAndUpdate(userId, { lastLoginAt: new Date() }, { new: true });
    }
    static async findAll() {
        return user_model_1.User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
    }
    static async findPublicById(userId) {
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            throw new AppError_1.AppError('Invalid id', 400);
        }
        return user_model_1.User.findById(userId, { passwordHash: 0 });
    }
    static async updateStatus(userId, isActive) {
        const user = await user_model_1.User.findByIdAndUpdate(userId, { isActive }, { new: true, projection: { passwordHash: 0 } });
        if (!user) {
            throw new AppError_1.AppError('User not found', 404);
        }
        return user;
    }
}
exports.UserService = UserService;
