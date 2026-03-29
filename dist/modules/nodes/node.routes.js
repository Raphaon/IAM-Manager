"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const node_controller_1 = require("./node.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const permission_middleware_1 = require("../../middlewares/permission.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authMiddleware, (0, permission_middleware_1.authorize)('create', 'node'), node_controller_1.NodeController.create);
router.get('/', auth_middleware_1.authMiddleware, (0, permission_middleware_1.authorize)('read', 'node'), node_controller_1.NodeController.list);
router.get('/tree', auth_middleware_1.authMiddleware, (0, permission_middleware_1.authorize)('read', 'node'), node_controller_1.NodeController.tree);
router.get('/:id', auth_middleware_1.authMiddleware, (0, permission_middleware_1.authorize)('read', 'node', {
    getNodeId: (req) => {
        const id = req.params.id;
        return typeof id === 'string' ? id : undefined;
    }
}), node_controller_1.NodeController.getById);
exports.default = router;
