"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const permission_middleware_1 = require("../../middlewares/permission.middleware");
const router = (0, express_1.Router)();
router.get('/invoice/:id/read', auth_middleware_1.authMiddleware, (0, permission_middleware_1.authorize)('read', 'invoice', {
    getNodeId: (req) => typeof req.query.nodeId === 'string' ? req.query.nodeId : undefined,
    getResourceData: (req) => ({
        ownerId: req.query.ownerId,
        classification: req.query.classification,
        status: req.query.status,
        amount: req.query.amount ? Number(req.query.amount) : undefined
    })
}), (req, res) => {
    res.status(200).json({
        message: 'Invoice access granted'
    });
});
exports.default = router;
