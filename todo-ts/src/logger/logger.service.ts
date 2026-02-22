import { singleton, inject } from "tsyringe";
import winston, { Logger, transport } from "winston";
import { TOKENS } from "@/container/tokens";
import type { IConfigService } from "@/config/config.service";

export interface ILoggerService {
  addTransport: (transportInfo: transport) => void;
  log: (logLevel: string, message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
  http: (message: string, meta?: Record<string, unknown>) => void;
  getLogger: () => Logger;
}

type LoggerConfigOptions = {
  levels: Record<string, number>;
  consoleLogLevel: string;
  fileLogLevel: string;
  logFolderPath: string;
  logFileName: string;
};

@singleton()
export class LoggerService implements ILoggerService {
  private logger: Logger;

  constructor(@inject(TOKENS.Config) private configService: IConfigService) {
    const loggerConfig = this.configService.get<LoggerConfigOptions>("logger");
    const nodeEnvironment = this.configService.get("nodeEnv");

    const baseFormat = winston.format.combine(
      winston.format.errors({ stack: true }),
      winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss A" })
    );

    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.printf((options) => {
        return `Time: ${options["timestamp"]} PID: ${process.pid} [${options.level}]: ${options.message} ${options["stack"] || ""}`;
      })
    );

    const fileFormat = winston.format.combine(winston.format.json());

    this.logger = winston.createLogger({
      levels: loggerConfig.levels,
      level: loggerConfig.consoleLogLevel,
      format: baseFormat,
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
        }),
      ],
    });

    if (nodeEnvironment === "production") {
      this.logger.add(
        new winston.transports.File({
          filename: `${loggerConfig.logFolderPath}/${loggerConfig.logFileName}`,
          level: loggerConfig.fileLogLevel,
          format: fileFormat,
        })
      );
    }
  }

  addTransport(transportInfo: transport) {
    this.logger.add(transportInfo);
  }

  log(logLevel: string = "debug", message: string, meta: Record<string, unknown> = {}) {
    this.logger.log({ level: logLevel, message, ...meta });
  }

  info(message: string, meta: Record<string, unknown> = {}) {
    this.logger.info(message, meta);
  }

  error(message: string, meta: Record<string, unknown> = {}) {
    this.logger.error(message, meta);
  }

  warn(message: string, meta: Record<string, unknown> = {}) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta: Record<string, unknown> = {}) {
    this.logger.debug(message, meta);
  }

  http(message: string, meta: Record<string, unknown> = {}) {
    this.logger.http(message, meta);
  }

  getLogger() {
    return this.logger;
  }
}
