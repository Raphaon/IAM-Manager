"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceController = void 0;
const resource_service_1 = require("./resource.service");
class ResourceController {
    static async create(req, res, next) {
        try {
            const resource = await resource_service_1.ResourceService.create(req.body);
            res.status(201).json(resource);
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const resources = await resource_service_1.ResourceService.findAll();
            res.status(200).json(resources);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ResourceController = ResourceController;
