export interface LoginCredentials {
  email: string;
  password: string;
}

export type LoginHandler = (
  credentials: LoginCredentials,
) => void | Promise<void>;

export type ResetPasswordHandler = (email: string) => void | Promise<void>;
