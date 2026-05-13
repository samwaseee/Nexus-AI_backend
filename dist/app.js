"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("./config/cors"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middleware/error.middleware");
require("./config/passport");
const ApiError_1 = require("./utils/ApiError");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(cors_1.default);
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
if (env_1.env.IS_DEVELOPMENT) {
    app.use((0, morgan_1.default)("dev"));
}
else {
    app.use((0, morgan_1.default)("combined"));
}
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.env.RATE_LIMIT_WINDOW_MS,
    max: env_1.env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", globalLimiter);
app.use(passport_1.default.initialize());
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "NexusAI API is running",
        environment: env_1.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});
app.use("/api/v1", routes_1.default);
app.use((_req, _res, next) => {
    next(new ApiError_1.ApiError(404, `Route not found: ${_req.originalUrl}`));
});
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map