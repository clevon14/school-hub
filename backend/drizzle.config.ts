import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema/index.ts",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./db/sqlite.db",
  },
} satisfies Config;
