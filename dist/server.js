"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const env_1 = require("./config/env");
const startServer = async () => {
    await (0, db_1.default)();
    const server = app_1.default.listen(env_1.env.PORT, () => {
        console.log(`🚀 NexusAI API running on port ${env_1.env.PORT} [${env_1.env.NODE_ENV}]`);
        console.log(`   Health: http://localhost:${env_1.env.PORT}/health`);
        console.log(`   API:    http://localhost:${env_1.env.PORT}/api/v1`);
    });
    const shutdown = (signal) => {
        console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
        server.close(() => {
            console.log("✅ HTTP server closed");
            process.exit(0);
        });
        setTimeout(() => {
            console.error("❌ Forced shutdown after timeout");
            process.exit(1);
        }, 10000);
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("unhandledRejection", (reason) => {
        console.error("❌ Unhandled Rejection:", reason);
        server.close(() => process.exit(1));
    });
    process.on("uncaughtException", (error) => {
        console.error("❌ Uncaught Exception:", error);
        server.close(() => process.exit(1));
    });
};
startServer();
//# sourceMappingURL=server.js.map