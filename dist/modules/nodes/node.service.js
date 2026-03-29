"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeService = void 0;
const mongoose_1 = require("mongoose");
const node_model_1 = require("./node.model");
const AppError_1 = require("../../shared/errors/AppError");
const slugify_1 = require("../../shared/utils/slugify");
class NodeService {
    static async create(data) {
        const name = data.name?.trim();
        if (!name) {
            throw new AppError_1.AppError('Node name is required', 400);
        }
        let parent = null;
        let ancestors = [];
        let path = `/${(0, slugify_1.slugify)(name)}`;
        if (data.parentId) {
            parent = await node_model_1.Node.findById(data.parentId);
            if (!parent) {
                throw new AppError_1.AppError('Parent node not found', 404);
            }
            ancestors = [...parent.ancestors, parent._id];
            path = `${parent.path}/${(0, slugify_1.slugify)(name)}`;
        }
        const existingPath = await node_model_1.Node.findOne({ path });
        if (existingPath) {
            throw new AppError_1.AppError('A node with this path already exists', 409);
        }
        const node = await node_model_1.Node.create({
            name,
            type: data.type,
            parentId: data.parentId || null,
            ancestors,
            path
        });
        return node;
    }
    static async findAll() {
        return node_model_1.Node.find().sort({ path: 1 });
    }
    static async findById(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new AppError_1.AppError('Invalid id', 400);
        }
        const node = await node_model_1.Node.findById(id);
        if (!node) {
            throw new AppError_1.AppError('Node not found', 404);
        }
        return node;
    }
    static async findChildren(parentId) {
        return node_model_1.Node.find({ parentId }).sort({ name: 1 });
    }
    static async buildTree(parentId = null) {
        const children = await node_model_1.Node.find({ parentId }).sort({ name: 1 });
        return Promise.all(children.map(async (node) => ({
            _id: node._id,
            name: node.name,
            type: node.type,
            path: node.path,
            children: await this.buildTree(String(node._id))
        })));
    }
}
exports.NodeService = NodeService;
