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

export type AquariumPayload = {
  aquariumId: number;
  name: string;
  type: AquariumType;
  volumeLitres: number;
  ph: number;
  gh: number;
  tds: number;
};

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
  VIEW : "VIEW",
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
  ) => Promise<boolean>;
};

type ViewModalProps = {
  mode: typeof Action.VIEW;
  closeForm: () => void;
  aquarium: Aquarium;
  onUpdateAquarium: (
    name: string,
    type: AquariumType,
    volume: number,
    ph: number,
    gh: number,
    tds: number,
  ) => Promise<boolean>;
};

export type AquariumModalProps = AddModalProps | ViewModalProps;

export type WaterStatus = "Good" | "Attention" | "Critical";
export type HistoryFilter = "All" | WaterStatus;
export type ChartParameter = "ammonia" | "nitrite" | "nitrate" | "ph" | "tds";
export type WaterReading = {
  id: number;
  recordedAt: string;
  ph: number;
  temperature: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  gh: number;
  kh: number;
  tds: number;
  note: string;
};


export type ReadingForm = Omit<WaterReading, "id" | "recordedAt">;

export type ParameterMeta = {
  key: keyof (Omit<ReadingForm, "note">);
  label: string;
  unit: string;
  ideal: string;
}

export const parameterMeta: ParameterMeta[] = [
  { key: "ph", label: "pH", unit: "", ideal: "6.5–7.5" },
  { key: "temperature", label: "Temperature", unit: "°C", ideal: "23–27 °C" },
  { key: "ammonia", label: "Ammonia", unit: "ppm", ideal: "0 ppm" },
  { key: "nitrite", label: "Nitrite", unit: "ppm", ideal: "0 ppm" },
  { key: "nitrate", label: "Nitrate", unit: "ppm", ideal: "< 20 ppm" },
  { key: "gh", label: "GH", unit: "dGH", ideal: "4–8 dGH" },
  { key: "kh", label: "KH", unit: "dKH", ideal: "3–6 dKH" },
  { key: "tds", label: "TDS", unit: "ppm", ideal: "120–220 ppm" },
] as const;
