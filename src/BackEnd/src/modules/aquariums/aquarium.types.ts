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
