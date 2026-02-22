import { defineConfig } from "drizzle-kit";
import config from "@/config/app.config";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/model/schema.ts",
  out: "./migrations",
  dbCredentials: {
    host: config.database.connectionHost,
    user: config.database.connectionUser,
    password: config.database.connectionPassword,
    database: config.database.connectionDatabase,
  }
});
