import { AppError } from "../../utils/AppError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import type { CreateAquariumInput, UpdateAquariumInput } from "./aquarium.schema.js";
import {
  deleteByIdAndOwner,
  findAllByOwner,
  findByIdAndOwner,
  insertAquarium,
  updateByIdAndOwner,
} from "./aquarium.repository.js";

const GET_AQUARIUM_NOT_FOUND_MESSAGE = "Aquarium not found";
const UPDATE_AQUARIUM_NOT_FOUND_MESSAGE = "Aquarium not found";
const DELETE_AQUARIUM_NOT_FOUND_MESSAGE = "Aquarium not found";

export const listAquariums = findAllByOwner;
export const createAquarium = insertAquarium;

export async function getAquarium(id: string, ownerId: string) {
  const aquarium = await findByIdAndOwner(id, ownerId);
  if (!aquarium) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, GET_AQUARIUM_NOT_FOUND_MESSAGE);
  }
  return aquarium;
}

export async function updateAquarium(id: string, ownerId: string, input: UpdateAquariumInput) {
  const aquarium = await updateByIdAndOwner(id, ownerId, input);
  if (!aquarium) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, UPDATE_AQUARIUM_NOT_FOUND_MESSAGE);
  }
  return aquarium;
}

export async function deleteAquarium(id: string, ownerId: string): Promise<void> {
  if (!(await deleteByIdAndOwner(id, ownerId))) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, DELETE_AQUARIUM_NOT_FOUND_MESSAGE);
  }
}

export type { CreateAquariumInput };
