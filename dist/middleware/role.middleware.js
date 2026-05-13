"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminOrFreelancer = exports.requireClient = exports.requireFreelancer = exports.requireAdmin = exports.requireRole = void 0;
const ApiError_1 = require("../utils/ApiError");
const requireRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(ApiError_1.ApiError.unauthorized("Authentication required"));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(ApiError_1.ApiError.forbidden(`Access denied. Required role(s): ${allowedRoles.join(", ")}`));
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)("admin");
exports.requireFreelancer = (0, exports.requireRole)("freelancer");
exports.requireClient = (0, exports.requireRole)("client");
exports.requireAdminOrFreelancer = (0, exports.requireRole)("admin", "freelancer");
//# sourceMappingURL=role.middleware.js.map