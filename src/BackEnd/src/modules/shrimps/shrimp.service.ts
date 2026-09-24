import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { AppError } from "../../utils/AppError.js";
import { findAll, findById, insertShrimp } from "./shrimp.repository.js";

export const listShrimps = findAll;
export const createShrimp = insertShrimp;

export async function getShrimp(id: string) {
  const shrimp = await findById(id);
  if (!shrimp) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Shrimp not found");
  }
  return shrimp;
}
