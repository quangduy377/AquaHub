import type {
  ParameterMeta,
  ReadingForm,
  WaterReading,
  WaterStatus,
} from "../features/aquariums/types/aquarium";

const WATER_STATUS = {
  GOOD: "Good",
  ATTENTION: "Attention",
  CRITICAL: "Critical",
} as const;

const WATER_PARAMETER = {
  PH: "ph",
  TEMPERATURE: "temperature",
  AMMONIA: "ammonia",
  NITRITE: "nitrite",
  NITRATE: "nitrate",
  GH: "gh",
  KH: "kh",
  TDS: "tds",
};

export function getParameterStatus(key: keyof ReadingForm, value: number): WaterStatus {
  if (key === WATER_PARAMETER.PH) return value < 6 || value > 8.2 ? WATER_STATUS.CRITICAL : value < 6.5 || value > 7.5 ? WATER_STATUS.ATTENTION : WATER_STATUS.GOOD;
  if (key === WATER_PARAMETER.TEMPERATURE) return value < 20 || value > 30 ? WATER_STATUS.CRITICAL : value < 23 || value > 27 ? WATER_STATUS.ATTENTION : WATER_STATUS.GOOD;
  if (key === WATER_PARAMETER.AMMONIA) return value > 0.5 ? WATER_STATUS.CRITICAL : value > 0 ? WATER_STATUS.ATTENTION : WATER_STATUS.GOOD;
  if (key === WATER_PARAMETER.NITRITE) return value > 0.5 ? WATER_STATUS.CRITICAL : value > 0 ? WATER_STATUS.ATTENTION : WATER_STATUS.GOOD;
  if (key === WATER_PARAMETER.NITRATE) return value > 40 ? WATER_STATUS.CRITICAL : value > 20 ? WATER_STATUS.ATTENTION : WATER_STATUS.GOOD;
  if (key === WATER_PARAMETER.GH) return value < 2 || value > 12 ? WATER_STATUS.CRITICAL : value < 4 || value > 8 ? WATER_STATUS.ATTENTION : WATER_STATUS.GOOD;
  if (key === WATER_PARAMETER.KH) return value < 1 || value > 10 ? WATER_STATUS.CRITICAL : value < 3 || value > 6 ? WATER_STATUS.ATTENTION : WATER_STATUS.GOOD;
  if (key === WATER_PARAMETER.TDS) return value < 70 || value > 350 ? WATER_STATUS.CRITICAL : value < 120 || value > 220 ? WATER_STATUS.ATTENTION : WATER_STATUS.GOOD;
  return WATER_STATUS.GOOD;
}

export function getReadingStatus(parameterMeta: ParameterMeta[], reading: WaterReading): WaterStatus {
  const statuses = parameterMeta.map(({ key }) => getParameterStatus(key, reading[key]));
  if (statuses.includes(WATER_STATUS.CRITICAL)) return WATER_STATUS.CRITICAL;
  if (statuses.includes(WATER_STATUS.ATTENTION)) return WATER_STATUS.ATTENTION;
  return WATER_STATUS.GOOD;
}
