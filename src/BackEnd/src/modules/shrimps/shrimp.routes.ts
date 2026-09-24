import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { createShrimp, getShrimp, getAllShrimps } from "./shrimp.controller.js";
import { createShrimpSchema } from "./shrimp.schema.js";

export const SHRIMP_ROUTES = {
  ROOT: "/",
  BY_ID: "/:shrimpId",
} as const;

export const shrimpRouter = Router();

shrimpRouter.use(authenticate);
shrimpRouter.get(SHRIMP_ROUTES.ROOT, getAllShrimps);
shrimpRouter.get(SHRIMP_ROUTES.BY_ID, getShrimp);
//TODO: only admin has privilege to create a shrimp, do this later.
shrimpRouter.post(SHRIMP_ROUTES.ROOT, validateBody(createShrimpSchema), createShrimp);
