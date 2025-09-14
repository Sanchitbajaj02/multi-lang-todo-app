import { mysqlTable as table } from "drizzle-orm/mysql-core";
import * as t from "drizzle-orm/mysql-core";

export const todos = table(
  "todos",
  {
    id: t.int().primaryKey().autoincrement(),
    title: t.varchar("title", { length: 100 }),
    description: t.text("description"),
    completed: t.boolean("completed").default(false),
  },
  (table) => [
    t.uniqueIndex("id_idx").on(table.id)
  ]
);
