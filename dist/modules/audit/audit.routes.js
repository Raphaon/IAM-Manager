"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_controller_1 = require("./audit.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const router = (0, express_1.Router)();
router.get('/', admin_middleware_1.requireAdmin, auth_middleware_1.authMiddleware, audit_controller_1.AuditController.list);
exports.default = router;
