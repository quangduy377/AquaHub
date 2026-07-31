import type { Aquarium } from "../types/aquarium";
import { CARIDINA,NEOCARIDINA } from "../types/aquarium";
export const aquariums: Aquarium[] = [
  {
    id: 1,
    name: "Galaxy Shrimp Tank",
    type: CARIDINA,
    volumeLitres: 38,
    ph: 5.8,
    gh: 4,
    tds: 115,
  },
  {
    id: 2,
    name: "Living Room Planted Tank",
    type: CARIDINA,
    volumeLitres: 113,
    ph: 6.8,
    gh: 6,
    tds: 180,
  },
  {
    id: 3,
    name: "Cherry Shrimp Tank",
    type: NEOCARIDINA,
    volumeLitres: 20,
    ph: 7.2,
    gh: 8,
    tds: 220,
  },
];