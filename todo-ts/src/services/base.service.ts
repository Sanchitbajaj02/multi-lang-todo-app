import { inject } from "tsyringe";
import { TOKENS } from "@/container/tokens";
import type { ILoggerService } from "@/logger/logger.service";
import type { IDrizzleService } from "@/databases/drizzle.service";
import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@/model/schema";

export abstract class BaseService {
  constructor(
    @inject(TOKENS.Logger) protected logger: ILoggerService,
    @inject(TOKENS.DrizzleClient) protected databaseService: IDrizzleService
  ) {}

  /**
   * Lazily resolve the current Drizzle client from the database service.
   * The Drizzle client is created when the service is connected at app startup,
   * so resolving it here (when a method is invoked) avoids accessing an
   * undefined client during DI construction time.
   */
  protected get db(): MySql2Database<typeof schema> {
    return this.databaseService.getClient();
  }
}
