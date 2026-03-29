"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    static async register(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.register(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.login(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async me(req, res) {
        res.status(200).json({
            user: req.user
        });
    }
    static async refresh(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.refresh(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.logout(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
