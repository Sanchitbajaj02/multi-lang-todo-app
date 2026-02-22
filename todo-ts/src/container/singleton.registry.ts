import { container, Lifecycle } from "tsyringe";
import { TOKENS } from "./tokens";
import { ConfigService } from "@/config/config.service";
import { LoggerService } from "@/logger/logger.service";
import DrizzleService from "@/databases/drizzle.service";

// Register ConfigService as singleton (must be first - other services depend on it)
container.register(
  TOKENS.Config,
  {
    useClass: ConfigService,
  },
  { lifecycle: Lifecycle.Singleton }
);

// Register LoggerService as singleton
container.register(
  TOKENS.Logger,
  {
    useClass: LoggerService,
  },
  { lifecycle: Lifecycle.Singleton }
);

// TODO: Register PrismaService as singleton
container.register(
  TOKENS.DrizzleClient,
  {
    useClass: DrizzleService,
  },
  { lifecycle: Lifecycle.Singleton }
);
