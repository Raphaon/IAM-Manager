"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (query, defaultLimit = 10, maxLimit = 100) => {
    const rawPage = Number(query.page);
    const rawLimit = Number(query.limit);
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = Number.isInteger(rawLimit) && rawLimit > 0
        ? Math.min(rawLimit, maxLimit)
        : defaultLimit;
    return {
        page,
        limit,
        skip: (page - 1) * limit
    };
};
exports.getPagination = getPagination;
