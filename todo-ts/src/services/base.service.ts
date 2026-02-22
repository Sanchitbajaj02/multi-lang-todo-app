import { inject } from "tsyringe";
import { TOKENS } from "@/container/tokens";
import type { ILoggerService } from "@/logger/logger.service";
import type { IDrizzleService } from "@/databases/drizzle.service";
import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@/model/schema";

export abstract class BaseService {
  protected dbClient: MySql2Database<typeof schema>;

  constructor(
    @inject(TOKENS.Logger) protected logger: ILoggerService,
    @inject(TOKENS.DrizzleClient) protected databaseService: IDrizzleService
  ) {
    this.dbClient = this.databaseService.getClient();
  }
}
