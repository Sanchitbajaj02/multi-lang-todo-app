import "reflect-metadata"
import { defineConfig } from "drizzle-kit";
import { ConfigService } from "@/config/config.service";

const config = new ConfigService().getAll();

export default defineConfig({
  dialect: "mysql",
  schema: "./src/model/schema.ts",
  out: "./migrations",
  dbCredentials: {
    host: config.database.connectionHost!,
    user: config.database.connectionUser!,
    password: config.database.connectionPassword!,
    database: config.database.connectionDatabase!,
  }
});
