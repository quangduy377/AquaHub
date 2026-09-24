export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  TESTING_SHRIMPS: "/shrimps",
  SHRIMP_DETAIL: "/shrimps/:shrimpId",
  AQUARIUMS: "/aquariums/:email",
  AQUARIUM_WATER_QUALITY: "/aquariums/:email/:aquariumId/water-quality",

} as const;

export const PARAM_ROUTES = {
  SHRIMP_DETAIL: (shrimpId: string) => `/shrimps/${encodeURIComponent(shrimpId)}`,
  AQUARIUMS: (email: string) =>
    `/aquariums/${encodeURIComponent(email)}`,

  AQUARIUM_WATER_QUALITY : {
    EmailParamKey: "email",
    AquariumIdParamKey: "aquariumId",
    URL: (encondedEmail: string, aquariumId:string) => `/aquariums/${encondedEmail}/${aquariumId}/water-quality`
  }
} as const;
