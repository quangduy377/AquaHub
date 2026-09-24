import type { Request, Response } from "express";
import { z } from "zod";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { AppError } from "../../utils/AppError.js";
import type { CreateShrimpInput } from "./shrimp.schema.js";
import { createShrimp as createOneShrimp, getShrimp as getOneShrimp, listShrimps } from "./shrimp.service.js";

export async function getAllShrimps(_request: Request, response: Response): Promise<void> {
  response.json({ shrimps: await listShrimps() });
}

export async function getShrimp(request: Request, response: Response): Promise<void> {
  const result = z.uuid().safeParse(request.params.shrimpId);
  if (!result.success) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, "Invalid shrimp ID");
  }
  response.json({ shrimp: await getOneShrimp(result.data) });
}

export async function createShrimp(request: Request, response: Response): Promise<void> {
  const shrimp = await createOneShrimp(request.body as CreateShrimpInput);
  if(!shrimp) throw new AppError(HTTP_STATUS.BAD_REQUEST, "Unable to create a new shrimp data.");
  response.status(HTTP_STATUS.CREATED).json({ shrimp });
}
