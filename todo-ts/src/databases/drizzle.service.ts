import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@/model/schema";
import { inject, singleton } from "tsyringe";

import { TOKENS } from "@/container/tokens";
import type { ILoggerService } from "@/logger/logger.service";
import type { IConfigService } from "@/config/config.service";

export interface IDrizzleService {
  getClient(): MySql2Database<typeof schema>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

@singleton()
export default class DrizzleService implements IDrizzleService {
  private drizzle!: MySql2Database<typeof schema>;
  private pool!: mysql.Pool;

  constructor(
    @inject(TOKENS.Logger) private logger: ILoggerService,
    @inject(TOKENS.Config) private configService: IConfigService
  ) {}

  getClient(): MySql2Database<typeof schema> {
    return this.drizzle;
  }

  async connect(): Promise<void> {
    try {
      const connectionString = this.configService.get<string>(
        "database.connectionURL"
      );

      // Create mysql2 pool
      this.pool = mysql.createPool({
        uri: connectionString,
        connectionLimit: 10,
      });

      // Drizzle wraps mysql pool
      this.drizzle = drizzle(this.pool, {
        schema: schema,
        mode: "default",
        logger: {
          logQuery: (query, params) => {
            this.logger.debug(`Query: ${query}`, { params });
          },
        },
      });

      this.logger.info("Database connected successfully");
    } catch (error) {
      this.logger.error("Failed to connect to database", { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.logger.info("Database disconnected");
    }
  }
}
