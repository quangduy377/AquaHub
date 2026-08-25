import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { currentUser, loginUser, logoutUser, registerUser } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

export const AUTH_ROUTES = {
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",
  CURRENT_USER: "/me",
} as const;

export const authRouter = Router();

authRouter.post(AUTH_ROUTES.REGISTER, validateBody(registerSchema), registerUser);
authRouter.post(AUTH_ROUTES.LOGIN, validateBody(loginSchema), loginUser);
authRouter.post(AUTH_ROUTES.LOGOUT, logoutUser);
authRouter.get(AUTH_ROUTES.CURRENT_USER, authenticate, currentUser);
