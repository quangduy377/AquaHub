export const ShrimpTypes = {
    Neocardiana: "Neocaridina",
    Cardiana : "Caridina"
} as const

export type Category = (typeof ShrimpTypes)[keyof typeof ShrimpTypes];

export type Shrimp = {
  id: string;
  name: string;
  category: Category;
  imageURL: string;
  description: string;
};