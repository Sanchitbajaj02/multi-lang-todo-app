import express, { Application, Router } from "express";
import { injectable, inject } from "tsyringe";
import { TOKENS } from "@/container/tokens";
import type { ILoggerService } from "@/logger/logger.service";
import type { IConfigService, AppConfig } from "@/config/config.service";
import ErrorHandler from "@/middleware/error-handler";
import MorganLogger from "@/middleware/morgan-middleware";
import ServerProtection from "@/middleware/service-protection";
import RateLimit from "@/lib/rate-limit";

export interface IApp {
  getInstance(): Application;
  setupMiddleware(): void;
  setupRoutes(router: Router): void;
  setupErrorHandling(): void;
}

@injectable()
export class App implements IApp {
  private app: Application;

  constructor(
    @inject(TOKENS.Logger) private logger: ILoggerService,
    @inject(TOKENS.Config) private config: IConfigService
  ) {
    this.app = express();
  }

  getInstance(): Application {
    return this.app;
  }

  setupMiddleware(): void {
    // Body parsing
    this.app.use(express.json({ limit: "1mb" }));
    this.app.use(express.urlencoded({ extended: true }));

    // Morgan HTTP logging
    const nodeEnv = this.config.get<string>("nodeEnv");
    const morganLogger = new MorganLogger(
      this.logger.getLogger(),
      nodeEnv === "development" ? "dev" : "combined"
    );
    this.app.use(morganLogger.createMorganMiddleware());

    // Security middleware
    const securityConfig = this.config.get<AppConfig["security"]>("security");
    const serverProtection = new ServerProtection(
      this.logger.getLogger(),
      {
        blockOnThreat: securityConfig.blockOnThreat,
        logThreats: securityConfig.logThreats,
      },
      securityConfig.allowedOrigins,
      securityConfig.xssOptions
    );

    this.app.use(
      serverProtection.corsProtection({
        allowedOrigins: securityConfig.allowedOrigins,
        credentials: securityConfig.credentials,
      })
    );
    this.app.use(serverProtection.miscProtection());
    this.app.use(serverProtection.xssProtection());

    // Rate limiting
    const rateLimitConfig = this.config.get<AppConfig["rateLimit"]>("rateLimit");
    const rateLimit = new RateLimit(
      this.logger.getLogger(),
      rateLimitConfig.limit,
      rateLimitConfig.windowSeconds
    );
    this.app.use(rateLimit.rateLimiter());

    this.logger.info("Middleware configured");
  }

  setupRoutes(router: Router): void {
    this.app.use("/api/v1", router);
    this.logger.info("Routes configured");
  }

  setupErrorHandling(): void {
    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
      });
    });

    // Global error handler
    const errorHandler = new ErrorHandler(this.logger.getLogger());
    this.app.use(errorHandler.handle);

    this.logger.info("Error handling configured");
  }
}
