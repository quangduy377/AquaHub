
import type { AuthenticatedUser, LoginCredentials } from "../types/auth";

const LOGIN_ENDPOINT = "/api/auth/login";
const LOGOUT_ENDPOINT = "/api/auth/logout";
const CURRENT_USER_ENDPOINT = "/api/auth/me";
const FORGOT_PASSWORD_ENDPOINT = "/api/auth/forgot-password";
const POST_METHOD = "POST";
const INCLUDE_CREDENTIALS = "include";
const CONTENT_TYPE_HEADER = "Content-Type";
const JSON_CONTENT_TYPE = "application/json";
const LOGIN_FAILED_MESSAGE = "Email or password is incorrect.";
const UNKNOWN_ERROR_MESSAGE = "An unidentified error occurred.";
const SESSION_VERIFICATION_FAILED_MESSAGE = "Unable to verify the current session.";
const RESET_PASSWORD_FAILED_MESSAGE = "Unable to send reset instructions.";

export async function logOut(): Promise<void>{
  try{
    const response = await fetch(LOGOUT_ENDPOINT,{
    method: POST_METHOD,
    credentials: INCLUDE_CREDENTIALS,
      headers: {
        [CONTENT_TYPE_HEADER]: JSON_CONTENT_TYPE,
      },
    });
    if(!response.ok) throw new Error("Something went wrong with the logout");
  }
  catch(err){
    throw new Error("Something went wrong with the logout", {cause: err});
  }
}

export async function login(
  credentials: LoginCredentials,
): Promise<void> {
  try {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: POST_METHOD,
      credentials: INCLUDE_CREDENTIALS,
      headers: {
        [CONTENT_TYPE_HEADER]: JSON_CONTENT_TYPE,
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

export async function getCurrentUser(
  signal?: AbortSignal,
): Promise<AuthenticatedUser | null> {
  try{
    const response = await fetch(CURRENT_USER_ENDPOINT, {
      credentials: INCLUDE_CREDENTIALS,
      signal,
    });

    if (response.status === 401) return null;
    if (!response.ok) {
      throw new Error(SESSION_VERIFICATION_FAILED_MESSAGE);
    }

    const body = (await response.json()) as { user?: AuthenticatedUser };
    if (!body?.user) return null;
    return body.user;

  }
  catch {
    return null;
  }
  
}

//TODO: NOT WORK FOR NOW BECAUSE WE DON'T HAVE API ENDPOINT
export async function resetPassword(email: string): Promise<boolean> {
  const response = await fetch(FORGOT_PASSWORD_ENDPOINT, {
    method: POST_METHOD,
    headers: {
      [CONTENT_TYPE_HEADER]: JSON_CONTENT_TYPE,
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(RESET_PASSWORD_FAILED_MESSAGE);
  }

  return true;
}
