import { randomUUID } from "node:crypto";
import { database } from "../../database/pool.js";
import type { UserRecord } from "./user.types.js";

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

function mapUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
  };
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const result = await database.query<UserRow>(
    `SELECT id, email, password_hash, created_at
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [email],
  );

  const row = result.rows[0];
  return row ? mapUser(row) : null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const result = await database.query<UserRow>(
    `SELECT id, email, password_hash, created_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [id],
  );

  const row = result.rows[0];
  return row ? mapUser(row) : null;
}

export async function createUser(email: string, passwordHash: string): Promise<UserRecord> {
  const result = await database.query<UserRow>(
    `INSERT INTO users (id, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, email, password_hash, created_at`,
    [randomUUID(), email, passwordHash],
  );

  return mapUser(result.rows[0]!);
}
