export const ALL = "All";
export const PLANTED = "Planted";
export const CARIDINA = "Caridina";
export const NEOCARIDINA = "Neocaridina";
export const COMMUNITY_FISH = "Community Fish";

export const AQUARIUM_TYPES: AquariumType[] = [
  ALL,
  PLANTED,
  CARIDINA,
  NEOCARIDINA,
  COMMUNITY_FISH,
];

export type AquariumType =
  | typeof ALL
  | typeof PLANTED
  | typeof CARIDINA
  | typeof NEOCARIDINA
  | typeof COMMUNITY_FISH;

export interface Aquarium {
  id: number;
  name: string;
  type: AquariumType;
  volumeLitres: number;
  ph: number;
  gh: number;
  tds: number;
}

export const Action = {
  ADD: "ADD",
  EDIT: "EDIT"
} as const;

type AddModalProps = {
  mode: typeof Action.ADD;
  closeForm: () => void;
  onAddAquarium: (
    name: string,
    type: AquariumType,
    volume: string,
    ph: string,
    gh: string,
    tds: string,
  ) => boolean;
};

type EditModalProps = {
  mode: typeof Action.EDIT;
  closeForm: () => void;
  aquarium: Aquarium;
  onUpdateAquarium: (
    name: string,
    type: AquariumType,
    volume: number,
    ph: number,
    gh: number,
    tds: number,
  ) => boolean;
};

export type AquariumModalProps = AddModalProps | EditModalProps;
