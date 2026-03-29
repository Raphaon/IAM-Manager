"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resource_controller_1 = require("./resource.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authMiddleware, resource_controller_1.ResourceController.create);
router.get('/', auth_middleware_1.authMiddleware, resource_controller_1.ResourceController.list);
exports.default = router;
