// src/features/auth/services/authService.ts

import type { LoginCredentials } from "../types/auth";

const LOGIN_ENDPOINT = "/api/auth/login";
const LOGIN_FAILED_MESSAGE = "Email or password is incorrect.";
const UNKNOWN_ERROR_MESSAGE = "An unidentified error occurred.";

export async function login(
  credentials: LoginCredentials,
): Promise<void> {
  try {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(body?.message ?? LOGIN_FAILED_MESSAGE);
    }
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(UNKNOWN_ERROR_MESSAGE, { cause: error });
  }
}

//TODO: NOT WORK FOR NOW BECAUSE WE DON'T HAVE API ENDPOINT
export async function resetPassword(email: string): Promise<boolean> {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Unable to send reset instructions.");
  }

  return true;
}
