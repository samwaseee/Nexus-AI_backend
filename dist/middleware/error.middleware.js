"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
const errorHandler = (err, req, res, _next) => {
    let error;
    if (err instanceof ApiError_1.ApiError) {
        error = err;
    }
    else if (err instanceof zod_1.ZodError) {
        const errors = err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
        }));
        error = new ApiError_1.ApiError(422, "Validation failed", errors);
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        const errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        error = new ApiError_1.ApiError(400, "Database validation failed", errors);
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        error = new ApiError_1.ApiError(400, `Invalid ${err.path}: ${err.value}`);
    }
    else if (err.code === 11000) {
        const field = Object.keys(err.keyValue ?? {})[0];
        error = ApiError_1.ApiError.conflict(`${field} already exists`);
    }
    else if (err instanceof Error) {
        error = new ApiError_1.ApiError(500, env_1.env.IS_PRODUCTION ? "Internal server error" : err.message);
    }
    else {
        error = ApiError_1.ApiError.internal();
    }
    if (env_1.env.IS_DEVELOPMENT) {
        console.error(`[${req.method}] ${req.path}`, {
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors,
            stack: error.stack,
        });
    }
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors.length > 0 ? error.errors : undefined,
        ...(env_1.env.IS_DEVELOPMENT && { stack: error.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map