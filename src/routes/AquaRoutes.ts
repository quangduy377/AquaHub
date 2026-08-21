export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  AQUARIUMS: "/aquariums",
  //Not yet use this route
  AQUARIUM_DETAIL: (aquariumId: string) =>
    `/aquariums/${aquariumId}`,
} as const;