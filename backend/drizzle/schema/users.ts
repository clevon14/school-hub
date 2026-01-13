import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { schools } from "./schools";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  schoolId: integer("school_id")
    .notNull()
    .references(() => schools.id),

  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),

  role: text("role").notNull(), // admin | teacher | office_staff
});
