"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data, meta) => ({
    success: true,
    data,
    meta: meta ?? null
});
exports.successResponse = successResponse;
const errorResponse = (message, details) => ({
    success: false,
    message,
    details: details ?? null
});
exports.errorResponse = errorResponse;
