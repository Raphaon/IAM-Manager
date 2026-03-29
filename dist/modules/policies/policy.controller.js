"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyController = void 0;
const policy_service_1 = require("./policy.service");
class PolicyController {
    static async create(req, res, next) {
        try {
            const policy = await policy_service_1.PolicyService.create(req.body);
            res.status(201).json(policy);
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const policies = await policy_service_1.PolicyService.findAll();
            res.status(200).json(policies);
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = String(req.params.id);
            const policy = await policy_service_1.PolicyService.findById(id);
            res.status(200).json(policy);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PolicyController = PolicyController;
