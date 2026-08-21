// src/features/auth/services/authService.ts

import type { LoginCredentials } from "../types/auth";

//TODO: REMOVE_THIS
const DUMMY_EMAIL = "quangduy377@gmail.com";
const DUMMY_PASSWORD = "123456";

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function login(
  credentials: LoginCredentials,
): Promise<void> {
  // TODO Use real API
  try{
    // const response = await fetch("/api/auth/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(credentials),
    // });
    // if (!response.ok) throw new Error("Email or password is incorrect.");
    await delay(2000);
    if(credentials.email===DUMMY_EMAIL 
      && credentials.password===DUMMY_PASSWORD) return;
    throw new Error("Email or Password is incorrect");

  } catch (error) {
    if (error instanceof Error) throw error; 
    throw new Error("unidentified error occured !!!!",{cause: error});
  }
}

export async function resetPassword(email: string): Promise<boolean> {
  // TODO Use real API
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