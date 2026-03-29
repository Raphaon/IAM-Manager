"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const AppError_1 = require("../shared/errors/AppError");
const api_response_1 = require("../shared/utils/api-response");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json((0, api_response_1.errorResponse)(err.message, err.details));
    }
    console.error(err);
    return res.status(500).json((0, api_response_1.errorResponse)('Internal Server Error'));
};
exports.errorMiddleware = errorMiddleware;
