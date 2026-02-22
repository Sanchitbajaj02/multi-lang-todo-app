import "reflect-metadata";
import "dotenv/config";

// Import container configuration (must be after reflect-metadata)
import "@/container";

import { container } from "tsyringe";
import { TOKENS } from "@/container/tokens";
import { App } from "@/app.factory";
import type { ILoggerService } from "@/logger/logger.service";
import type { IConfigService } from "@/config/config.service";
import type { IDrizzleService } from "@/databases/drizzle.service";
import routes from "@/routes";

async function server() {
  // Resolve services from container
  const logger = container.resolve<ILoggerService>(TOKENS.Logger);
  const config = container.resolve<IConfigService>(TOKENS.Config);
  const databaseService = container.resolve<IDrizzleService>(TOKENS.DrizzleClient);
  const app = container.resolve(App);

  try {
    // Connect to database
    await databaseService.connect();

    // Setup application
    app.setupMiddleware();
    app.setupRoutes(routes);
    app.setupErrorHandling();

    // Start server
    const port = config.get<number>("port");
    const expressApp = app.getInstance();

    expressApp.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info(`Environment: ${config.get<string>("nodeEnv")}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      await databaseService.disconnect();
      process.exit(0);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

server();
