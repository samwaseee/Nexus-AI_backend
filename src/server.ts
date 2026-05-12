import app from "./app";
import connectDB from "./config/db";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 NexusAI API running on port ${env.PORT} [${env.NODE_ENV}]`);
    console.log(`   Health: http://localhost:${env.PORT}/health`);
    console.log(`   API:    http://localhost:${env.PORT}/api/v1`);
  });

  // ─── Graceful shutdown ────────────────────────────────────────────────────
  const shutdown = (signal: string) => {
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

  // ─── Unhandled rejections / exceptions ───────────────────────────────────
  process.on("unhandledRejection", (reason: unknown) => {
    console.error("❌ Unhandled Rejection:", reason);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (error: Error) => {
    console.error("❌ Uncaught Exception:", error);
    server.close(() => process.exit(1));
  });
};

startServer();