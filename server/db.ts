import pg from "pg";
const { Pool } = pg;
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import { drizzle as drizzleSQLite } from "drizzle-orm/better-sqlite3";
import * as sqliteSchema from "../shared/schema";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("A variável de ambiente DATABASE_URL não está configurada.");
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

const dbPath = "./test-database.sqlite";
const sqlite = new Database(dbPath);

export const sqliteDb = drizzleSQLite(sqlite, { schema: sqliteSchema });
