"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.user.systemRole !== 'admin') {
        console.warn('Admin access denied', {
            userId: req.user.userId,
            path: req.originalUrl,
            method: req.method,
        });
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}
exports.requireAdmin = requireAdmin;
