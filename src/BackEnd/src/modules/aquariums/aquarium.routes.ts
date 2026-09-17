import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { create, getOne, list, remove, update, getWaterQuality,addWaterQualityReading,removeWaterQualityReading } from "./aquarium.controller.js";
import { createAquariumSchema, updateAquariumSchema } from "./aquarium.schema.js";

const BY_ID_ROUTE = "/:aquariumId";

export const AQUARIUM_ROUTES = {
  ROOT: "/",
  BY_ID: BY_ID_ROUTE,
  BY_ID_TO_WATER_QUALITY: `/:email/:aquariumId/water-quality`
} as const;

export const aquariumRouter = Router();

aquariumRouter.use(authenticate);
aquariumRouter.get(AQUARIUM_ROUTES.ROOT, list);
aquariumRouter.post(AQUARIUM_ROUTES.ROOT, validateBody(createAquariumSchema), create);
aquariumRouter.get(AQUARIUM_ROUTES.BY_ID, getOne);
aquariumRouter.patch(
  AQUARIUM_ROUTES.BY_ID,
  validateBody(updateAquariumSchema),
  update,
);
aquariumRouter.delete(AQUARIUM_ROUTES.BY_ID, remove);
aquariumRouter.get(AQUARIUM_ROUTES.BY_ID_TO_WATER_QUALITY, getWaterQuality);
aquariumRouter.post(AQUARIUM_ROUTES.BY_ID_TO_WATER_QUALITY, addWaterQualityReading);
aquariumRouter.delete(AQUARIUM_ROUTES.BY_ID_TO_WATER_QUALITY, removeWaterQualityReading);


