import { IDatabaseClient } from "@/types/database.types";
import { StatusCodes } from "http-status-codes";
import CustomError from "@/lib/custom-error";
import { Logger } from "winston";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export default class DrizzleConnection implements IDatabaseClient {
  private connected = false;
  private logger: Logger;
  private config: any;
  private connection: any;

  constructor(logger: Logger, config: any) {
    this.logger = logger;
    this.config = config;
  }

  /**
   * @param connectionURL string
   * @param connectionType string
   * @param params any
   */
  async createConnection(): Promise<any> {
    try {
      const {
        connectionHost,
        connectionUser,
        connectionPassword,
        connectionDatabase,
      } = this.config.database;

      if (!connectionHost || !connectionUser || !connectionPassword || !connectionDatabase) {
        this.logger.warn(
          "No database connection provided, skipping connection"
        );
        return;
      }

      this.logger.info(`Connecting to database...`);

      /**
       * Write the actual connection logic here
       */
      const mysqlConnection = await mysql.createConnection({
        host: connectionHost,
        user: connectionUser,
        password: connectionPassword,
        database: connectionDatabase,
      });

      this.connection = drizzle({ client: mysqlConnection });

      this.connected = true;
      this.logger.info("Database connected successfully");
    } catch (error) {
      this.logger.error("Failed to connect to database", { error });
      throw new CustomError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Error in creation of Database Connection"
      );
    }
  }

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    if (this.connected) {
      this.logger.info("Disconnecting from database...");

      /**
       * Write the actual disconnection logic here
       */

      this.connected = false;
      this.logger.info("Database disconnected");
    }
  }

  /**
   * Check if the database is connected
   * @returns boolean
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Get the database connection
   * @returns Promise<any>
   */
  async getConnection(): Promise<any> {
    if (!this.connected) {
      throw new CustomError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Database not connected"
      );
    }
    /**
     * Return the actual database connection here
     */
    return this.connection;
  }
}
