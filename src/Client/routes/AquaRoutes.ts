export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  AQUARIUMS: "/aquariums/:email",
} as const;

export const PARAM_ROUTES = {
  AQUARIUMS: (email: string) =>
    `/aquariums/${encodeURIComponent(email)}`,
} as const;