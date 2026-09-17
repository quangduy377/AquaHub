export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  AQUARIUMS: "/aquariums/:email",
  AQUARIUM_WATER_QUALITY: "/aquariums/:email/:aquariumId/water-quality",

} as const;

export const PARAM_ROUTES = {
  AQUARIUMS: (email: string) =>
    `/aquariums/${encodeURIComponent(email)}`,

  AQUARIUM_WATER_QUALITY : {
    EmailParamKey: "email",
    AquariumIdParamKey: "aquariumId",
    URL: (encondedEmail: string, aquariumId:string) => `/aquariums/${encondedEmail}/${aquariumId}/water-quality`
  }
} as const;