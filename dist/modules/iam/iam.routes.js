"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const iam_controller_1 = require("./iam.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/debug-access', auth_middleware_1.authMiddleware, iam_controller_1.IAMController.debugAccess);
exports.default = router;
