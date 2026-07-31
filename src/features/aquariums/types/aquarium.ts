export const ALL = "All";
export const PLANTED = "Planted";
export const CARIDINA = "Caridina";
export const NEOCARIDINA = "Neocaridina";
export const COMMUNITY_FISH = "Community Fish";


export type AquariumType =
  | typeof ALL
  | typeof PLANTED
  | typeof CARIDINA
  | typeof NEOCARIDINA
  | typeof COMMUNITY_FISH

export interface Aquarium {
  id: number;
  name: string;
  type: AquariumType;
  volumeLitres: number;
  ph: number;
  gh: number;
  tds: number;
}