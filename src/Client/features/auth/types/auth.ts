export interface LoginCredentials {
  email: string;
  password: string;
}

export type LoginHandler = (
  credentials: LoginCredentials,
) => Promise<boolean>;

export type ResetPasswordHandler = (email: string) => Promise<boolean>;
