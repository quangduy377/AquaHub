export interface Aquarium {
  id: string;
  ownerId: string;
  name: string;
  type: string;
  volumeLitres: number;
  ph: number | null;
  gh: number | null;
  tds: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaterQualityReading {
  id: string;
  recordedAt: Date;
  ph: number;
  gh: number;
  kh: number;
  tds: number;
  temperature: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  note: string | null;
}