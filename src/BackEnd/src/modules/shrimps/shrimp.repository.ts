import { randomUUID } from "node:crypto";
import { database } from "../../database/pool.js";
import type { CreateShrimpInput } from "./shrimp.schema.js";
import type { Shrimp, ShrimpRow } from "./shrimp.types.js";

function mapShrimp(row: ShrimpRow): Shrimp {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    imageURL: row.imageURL,
    description: row.description,
  };
}

export async function findAll(): Promise<Shrimp[]> {
  const result = await database.query<ShrimpRow>(
    `SELECT * FROM shrimp ORDER BY name, id`,);
  if(!result.rows) return [];
  return result.rows.map(mapShrimp);
}

export async function findById(id: string): Promise<Shrimp | null> {
  const result = await database.query<ShrimpRow>(
    `SELECT * FROM shrimp WHERE id = $1 LIMIT 1`,
    [id],
  );
  return result.rows[0] ? mapShrimp(result.rows[0]) : null;
}

export async function insertShrimp(input: CreateShrimpInput): Promise<Shrimp | null> {
  const result = await database.query<ShrimpRow>(
    `INSERT INTO shrimp (id, name, category, imageURL, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [randomUUID(), input.name, input.category, input.imageURL,
      input.description],
  );
  if(!result.rows) return null;
  return mapShrimp(result.rows[0]!);
}
