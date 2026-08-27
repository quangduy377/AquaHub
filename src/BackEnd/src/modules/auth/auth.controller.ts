import type { Request, Response } from "express";
import { env } from "../../config/env.js";
import { AUTH_COOKIE_NAME } from "../../constants/auth.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { AppError } from "../../utils/AppError.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import { createAccessToken, getCurrentUser, login, register } from "./auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 15 * 60 * 1000,
  path: "/",
};

export async function registerUser(request: Request, response: Response): Promise<void> {
  const user = await register(request.body as RegisterInput);
  response.cookie(AUTH_COOKIE_NAME, createAccessToken(user.id), cookieOptions);
  response.status(HTTP_STATUS.CREATED).json({ user });
}

export async function loginUser(request: Request, response: Response): Promise<void> {
  const user = await login(request.body as LoginInput);
  response.cookie(AUTH_COOKIE_NAME, createAccessToken(user.id), cookieOptions);
  response.status(HTTP_STATUS.OK).json({ user });
}

export async function currentUser(request: Request, response: Response): Promise<void> {
  if (!request.userId) throw new AppError(HTTP_STATUS.UNAUTHORIZED, "Authentication required");
  response.status(HTTP_STATUS.OK).json({ user: await getCurrentUser(request.userId) });
}

export function logoutUser(_request: Request, response: Response): void {
  response.clearCookie(AUTH_COOKIE_NAME, cookieOptions);
  response.status(HTTP_STATUS.NO_CONTENT).send();
}
