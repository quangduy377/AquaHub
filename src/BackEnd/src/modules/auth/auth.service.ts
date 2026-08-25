import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { AppError } from "../../utils/AppError.js";
import { createUser, findUserByEmail, findUserById } from "../users/user.repository.js";
import type { PublicUser, UserRecord } from "../users/user.types.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";

const EMAIL_ALREADY_EXISTS_MESSAGE = "An account with this email already exists";
const INVALID_CREDENTIALS_MESSAGE = "Email or password is incorrect";
const USER_NO_LONGER_EXISTS_MESSAGE = "User no longer exists";

function toPublicUser(user: UserRecord): PublicUser {
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

export function createAccessToken(userId: string): string {
  return jwt.sign({}, env.JWT_SECRET, { subject: userId, expiresIn: "15m" });
}

export async function register(input: RegisterInput): Promise<PublicUser> {
  if (await findUserByEmail(input.email)) {
    throw new AppError(HTTP_STATUS.CONFLICT, EMAIL_ALREADY_EXISTS_MESSAGE);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  return toPublicUser(await createUser(input.email, passwordHash));
}

export async function login(input: LoginInput): Promise<PublicUser> {
  const user = await findUserByEmail(input.email);
  const passwordIsValid = user
    ? await bcrypt.compare(input.password, user.passwordHash)
    : false;

  if (!user || !passwordIsValid) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, INVALID_CREDENTIALS_MESSAGE);
  }

  return toPublicUser(user);
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, USER_NO_LONGER_EXISTS_MESSAGE);
  }

  return toPublicUser(user);
}
