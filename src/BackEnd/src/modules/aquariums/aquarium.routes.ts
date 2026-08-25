import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { create, getOne, list, remove, update } from "./aquarium.controller.js";
import { createAquariumSchema, updateAquariumSchema } from "./aquarium.schema.js";

export const AQUARIUM_ROUTES = {
  ROOT: "/",
  BY_ID: "/:aquariumId",
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
