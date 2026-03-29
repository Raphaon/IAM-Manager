"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeController = void 0;
const node_service_1 = require("./node.service");
class NodeController {
    static async create(req, res, next) {
        try {
            const node = await node_service_1.NodeService.create(req.body);
            res.status(201).json(node);
        }
        catch (error) {
            next(error);
        }
    }
    static async list(req, res, next) {
        try {
            const nodes = await node_service_1.NodeService.findAll();
            res.status(200).json(nodes);
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const id = String(req.params.id);
            const node = await node_service_1.NodeService.findById(id);
            res.status(200).json(node);
        }
        catch (error) {
            next(error);
        }
    }
    static async tree(req, res, next) {
        try {
            const tree = await node_service_1.NodeService.buildTree(null);
            res.status(200).json(tree);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NodeController = NodeController;
