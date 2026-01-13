import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { schools } from "./schools";

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  schoolId: integer("school_id")
    .notNull()
    .references(() => schools.id),

  admissionNo: text("admission_no").notNull(),
  name: text("name").notNull(),
  dob: text("dob"),
  parentName: text("parent_name"),
  phone: text("phone"),
});
