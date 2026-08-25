import type { Request, Response } from "express";
import { z } from "zod";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { AppError } from "../../utils/AppError.js";
import type { CreateAquariumInput, UpdateAquariumInput } from "./aquarium.schema.js";
import {
  createAquarium,
  deleteAquarium,
  getAquarium,
  listAquariums,
  updateAquarium,
} from "./aquarium.service.js";

const AUTHENTICATION_REQUIRED_MESSAGE = "Authentication required";
const INVALID_AQUARIUM_ID_MESSAGE = "Invalid aquarium ID";

function ownerIdFrom(request: Request): string {
  if (!request.userId) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      AUTHENTICATION_REQUIRED_MESSAGE,
    );
  }
  return request.userId;
}

function aquariumIdFrom(request: Request): string {
  const result = z.uuid().safeParse(request.params.aquariumId);
  if (!result.success) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, INVALID_AQUARIUM_ID_MESSAGE);
  }
  return result.data;
}

export async function list(request: Request, response: Response): Promise<void> {
  response.json({ aquariums: await listAquariums(ownerIdFrom(request)) });
}

export async function getOne(request: Request, response: Response): Promise<void> {
  response.json({ aquarium: await getAquarium(aquariumIdFrom(request), ownerIdFrom(request)) });
}

export async function create(request: Request, response: Response): Promise<void> {
  const aquarium = await createAquarium(ownerIdFrom(request), request.body as CreateAquariumInput);
  response.status(HTTP_STATUS.CREATED).json({ aquarium });
}

export async function update(request: Request, response: Response): Promise<void> {
  const aquarium = await updateAquarium(
    aquariumIdFrom(request),
    ownerIdFrom(request),
    request.body as UpdateAquariumInput,
  );
  response.json({ aquarium });
}

export async function remove(request: Request, response: Response): Promise<void> {
  await deleteAquarium(aquariumIdFrom(request), ownerIdFrom(request));
  response.status(HTTP_STATUS.NO_CONTENT).send();
}
