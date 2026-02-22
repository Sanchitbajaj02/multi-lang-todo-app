import { singleton } from "tsyringe";
import "dotenv/config";

export interface IConfigService {
  get<T>(key: string): T;
  getAll(): AppConfig;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  rateLimit: {
    limit: number;
    windowSeconds: number;
  };
  database: {
    connectionURL: string;
    shadowDatabaseUrl?: string;
    connectionType?: string;
    connectionHost?: string;
    connectionUser?: string;
    connectionPassword?: string;
    connectionDatabase?: string;
  };
  security: {
    allowedOrigins: string[];
    blockOnThreat: boolean;
    logThreats: boolean;
    credentials: boolean;
    xssOptions: {
      whiteList: Record<string, string[]>;
      stripIgnoreTag: boolean;
      stripIgnoreTagBody: string[];
      allowCommentTag: boolean;
      css: boolean;
    };
  };
  logger: {
    consoleLogLevel: string;
    fileLogLevel: string;
    logFolderPath: string;
    logFileName: string;
    levels: Record<string, number>;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

@singleton()
export class ConfigService implements IConfigService {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private getEnvironmentVariable<T>(key: string, defaultValue?: T): T {
    const value = process.env[key];

    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Missing environment variable: ${key}`);
    }

    return value as unknown as T;
  }

  private loadConfig(): AppConfig {
    return {
      port: Number(this.getEnvironmentVariable<number>("PORT", 5000)),
      nodeEnv: this.getEnvironmentVariable<string>("NODE_ENV", "development"),
      rateLimit: {
        limit: Number(
          this.getEnvironmentVariable<number>("RATE_LIMIT_LIMIT", 10)
        ),
        windowSeconds: Number(
          this.getEnvironmentVariable<number>("RATE_LIMIT_WINDOW_SECONDS", 300)
        ),
      },
      database: {
        // connectionURL: this.getEnvironmentVariable<string>("DATABASE_URL"),
        connectionURL: this.getEnvironmentVariable<string>("DATABASE_URL", ""),
        connectionType: this.getEnvironmentVariable<string>(
          "DATABASE_TYPE",
          "mysql"
        ),
        connectionHost: this.getEnvironmentVariable<string>(
          "DB_CONNECTION_HOST",
          "localhost"
        ),
        connectionUser: this.getEnvironmentVariable<string>("DB_USER", "user"),
        connectionPassword: this.getEnvironmentVariable<string>(
          "DB_PASSWORD",
          "12345678"
        ),
        connectionDatabase: this.getEnvironmentVariable<string>(
          "DB_NAME",
          "todo-app"
        ),
      },
      security: {
        allowedOrigins: this.getEnvironmentVariable<string[]>(
          "ALLOWED_ORIGINS",
          []
        ),
        blockOnThreat: this.getEnvironmentVariable<boolean>(
          "BLOCK_ON_THREAT",
          false
        ),
        logThreats: this.getEnvironmentVariable<boolean>("LOG_THREATS", true),
        credentials: this.getEnvironmentVariable<boolean>(
          "ALLOW_CREDENTIALS",
          false
        ),
        xssOptions: {
          whiteList: {},
          stripIgnoreTag: true,
          stripIgnoreTagBody: ["script", "style"],
          allowCommentTag: false,
          css: false,
        },
      },
      logger: {
        consoleLogLevel: "debug",
        fileLogLevel: "info",
        logFolderPath: "logs",
        logFileName: "error.log",
        levels: {
          error: 0,
          warn: 1,
          info: 2,
          http: 3,
          verbose: 4,
          debug: 5,
          silly: 6,
        },
      },
      jwt: {
        secret: this.getEnvironmentVariable<string>("JWT_SECRET", ""),
        expiresIn: this.getEnvironmentVariable<string>("JWT_EXPIRES_IN", "24h"),
      },
    };
  }

  get<T>(key: string): T {
    const keys = key.split(".");
    let value: unknown = this.config;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return undefined as T;
      }
    }

    return value as T;
  }

  getAll(): AppConfig {
    return this.config;
  }
}
