"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipController = void 0;
const membership_service_1 = require("./membership.service");
class MembershipController {
    static async create(req, res, next) {
        try {
            const membership = await membership_service_1.MembershipService.create(req.body);
            res.status(201).json(membership);
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const memberships = await membership_service_1.MembershipService.findAll();
            res.status(200).json(memberships);
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = String(req.params.id);
            const membership = await membership_service_1.MembershipService.findById(id);
            res.status(200).json(membership);
        }
        catch (error) {
            next(error);
        }
    }
    static async getByUser(req, res, next) {
        try {
            const userId = String(req.params.userId);
            const memberships = await membership_service_1.MembershipService.findByUser(userId);
            res.status(200).json(memberships);
        }
        catch (error) {
            next(error);
        }
    }
    static async getByNode(req, res, next) {
        try {
            const nodeId = String(req.params.nodeId);
            const memberships = await membership_service_1.MembershipService.findByNode(nodeId);
            res.status(200).json(memberships);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MembershipController = MembershipController;
