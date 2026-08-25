import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

export const database = new Pool({
  connectionString: env.DATABASE_URL,
});

database.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error", error);
});
