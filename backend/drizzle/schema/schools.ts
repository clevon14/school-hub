import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const schools = sqliteTable("schools", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  address: text("address"),
  phone: text("phone"),
});
