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
  getWaterQualityReadings,
  addWaterReading
} from "./aquarium.service.js";
import { WaterQualityReading } from "./aquarium.types.js";

const AUTHENTICATION_REQUIRED_MESSAGE = "Authentication required";
const INVALID_AQUARIUM_ID_MESSAGE = "Invalid aquarium ID";
const INVALID_WATER_READING_MESSAGE = "Invalid Water Reading, can't be added";

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

function parseWaterReading(request: Request): WaterQualityReading | null{
  const result = request.body as WaterQualityReading;
  if (!result) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, INVALID_WATER_READING_MESSAGE);
  }
  return result;
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

export async function getWaterQuality(request: Request, response: Response){
  const readings = await getWaterQualityReadings(aquariumIdFrom(request));
  response.json({readings: readings});
}

export async function addWaterQualityReading(request: Request, response: Response){
  const waterReading = parseWaterReading(request);
  if(!waterReading) {
    response.status(HTTP_STATUS.BAD_REQUEST).send();
    return;
  }
  const reading = await addWaterReading(aquariumIdFrom(request),waterReading);
  response.json({reading: reading});
}