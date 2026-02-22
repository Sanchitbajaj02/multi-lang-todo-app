import morgan from "morgan";
import { Logger } from "winston";
import { inject } from "tsyringe";

export default class MorganLogger {
  constructor(
    @inject("Logger") private logger: Logger,
    @inject("MorganLogConfig") private morganLogConfig: string
  ) {}

  public createMorganMiddleware() {
    return morgan(this.morganLogConfig, {
      stream: {
        write: (message) => this.logger.http(message.trim()),
      },
    });
  }
}
