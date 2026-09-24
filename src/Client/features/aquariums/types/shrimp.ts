export const ShrimpTypes = {
    Neocardiana: "Neocardiana",
    Cardiana : "Cardiana"
} as const

export type Category = (typeof ShrimpTypes)[keyof typeof ShrimpTypes];

export type Shrimp = {
  id: string;
  name: string;
  category: Category;
  imageURL: string;
  description: string;
};