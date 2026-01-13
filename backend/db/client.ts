import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../drizzle/schema/index.ts";

const sqlite = new Database("./db/sqlite.db");

export const db = drizzle(sqlite, { schema });

