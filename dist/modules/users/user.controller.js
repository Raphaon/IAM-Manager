"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const AppError_1 = require("../../shared/errors/AppError");
class UserController {
    static async list(req, res, next) {
        try {
            const users = await user_service_1.UserService.findAll();
            res.status(200).json(users);
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = String(req.params.id);
            const user = await user_service_1.UserService.findPublicById(id);
            if (!user) {
                throw new AppError_1.AppError('User not found', 404);
            }
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const { isActive } = req.body;
            if (typeof isActive !== 'boolean') {
                throw new AppError_1.AppError('isActive must be a boolean', 400);
            }
            const id = String(req.params.id);
            const user = await user_service_1.UserService.updateStatus(id, isActive);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
