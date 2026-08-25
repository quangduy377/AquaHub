import { randomUUID } from "node:crypto";
import { database } from "../../database/pool.js";
import type { CreateAquariumInput, UpdateAquariumInput } from "./aquarium.schema.js";
import type { Aquarium } from "./aquarium.types.js";

interface AquariumRow {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  volume_litres: number;
  ph: number | null;
  gh: number | null;
  tds: number | null;
  created_at: Date;
  updated_at: Date;
}

function mapAquarium(row: AquariumRow): Aquarium {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    type: row.type,
    volumeLitres: row.volume_litres,
    ph: row.ph,
    gh: row.gh,
    tds: row.tds,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findAllByOwner(ownerId: string): Promise<Aquarium[]> {
  const result = await database.query<AquariumRow>(
    `SELECT * FROM aquariums WHERE owner_id = $1 ORDER BY created_at DESC`,
    [ownerId],
  );
  return result.rows.map(mapAquarium);
}

export async function findByIdAndOwner(id: string, ownerId: string): Promise<Aquarium | null> {
  const result = await database.query<AquariumRow>(
    `SELECT * FROM aquariums WHERE id = $1 AND owner_id = $2 LIMIT 1`,
    [id, ownerId],
  );
  return result.rows[0] ? mapAquarium(result.rows[0]) : null;
}

export async function insertAquarium(ownerId: string, input: CreateAquariumInput): Promise<Aquarium> {
  const result = await database.query<AquariumRow>(
    `INSERT INTO aquariums (id, owner_id, name, type, volume_litres, ph, gh, tds)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [randomUUID(), ownerId, input.name, input.type, input.volumeLitres,
      input.ph ?? null, input.gh ?? null, input.tds ?? null],
  );
  return mapAquarium(result.rows[0]!);
}

export async function updateByIdAndOwner(
  id: string,
  ownerId: string,
  input: UpdateAquariumInput,
): Promise<Aquarium | null> {
  const current = await findByIdAndOwner(id, ownerId);
  if (!current) return null;

  const result = await database.query<AquariumRow>(
    `UPDATE aquariums
     SET name = $3, type = $4, volume_litres = $5, ph = $6, gh = $7,
         tds = $8, updated_at = NOW()
     WHERE id = $1 AND owner_id = $2
     RETURNING *`,
    [id, ownerId, input.name ?? current.name, input.type ?? current.type,
      input.volumeLitres ?? current.volumeLitres, input.ph === undefined ? current.ph : input.ph,
      input.gh === undefined ? current.gh : input.gh,
      input.tds === undefined ? current.tds : input.tds],
  );
  return result.rows[0] ? mapAquarium(result.rows[0]) : null;
}

export async function deleteByIdAndOwner(id: string, ownerId: string): Promise<boolean> {
  const result = await database.query(
    `DELETE FROM aquariums WHERE id = $1 AND owner_id = $2`,
    [id, ownerId],
  );
  return result.rowCount === 1;
}
