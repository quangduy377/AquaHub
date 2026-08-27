import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AUTH_COOKIE_NAME } from "../constants/auth.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "../utils/AppError.js";

const AUTH_ERROR_MESSAGES = {
  AUTHENTICATION_REQUIRED: "Authentication required",
  TOKEN_SUBJECT_MISSING: "Token subject is missing",
  INVALID_OR_EXPIRED_TOKEN: "Invalid or expired authentication token",
} as const;

interface AccessTokenPayload extends jwt.JwtPayload {
  sub: string;
}

export function authenticate(request: Request, _ : Response, next: NextFunction): void {
  const token = request.cookies?.[AUTH_COOKIE_NAME] as string | undefined;
  if (!token) {
    next(
      new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_ERROR_MESSAGES.AUTHENTICATION_REQUIRED,
      ),
    );
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;

    if (!payload.sub) {
      throw new Error(AUTH_ERROR_MESSAGES.TOKEN_SUBJECT_MISSING);
    }

    request.userId = payload.sub;
    next();
  } catch {
    next(
      new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        AUTH_ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN,
      ),
    );
  }
}
