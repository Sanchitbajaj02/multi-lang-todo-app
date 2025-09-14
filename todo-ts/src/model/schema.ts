import { mysqlTable as table } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";

export const taskSchema = table(
  "tasks",
  {
    id: t.varchar("id", { length: 36 }).primaryKey(),
    title: t.varchar("title", { length: 100 }).notNull(),
    description: t.varchar("description", { length: 255 }),
    completed: t.boolean("completed").default(false),
  }
);
