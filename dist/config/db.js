"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;
const connectDB = async (retries = MAX_RETRIES) => {
    try {
        const conn = await mongoose_1.default.connect(env_1.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        if (retries > 0) {
            console.warn(`⚠️  MongoDB connection failed: ${error.message}. Retrying in ${RETRY_DELAY_MS / 1000}s... (${retries} retries left)`);
            await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
            return connectDB(retries - 1);
        }
        console.error("❌ MongoDB connection failed after max retries:", error);
        process.exit(1);
    }
};
mongoose_1.default.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected");
});
mongoose_1.default.connection.on("reconnected", () => {
    console.log("✅ MongoDB reconnected");
});
exports.default = connectDB;
//# sourceMappingURL=db.js.map