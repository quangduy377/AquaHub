export interface LoginCredentials {
  email: string;
  password: string;
}

//MUST MATCH WITH THE 
export interface AuthenticatedUser {
  id: string;
  email: string;
  createdAt: string;
}

export type LoginHandler = (
  credentials: LoginCredentials,
) => Promise<boolean>;

export type ResetPasswordHandler = (email: string) => Promise<boolean>;
