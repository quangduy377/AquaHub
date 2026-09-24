type ShrimpDetails = {
  relatedImages: string[];
  parameters: { label: string; value: string }[];
  source: string;
  note: string;
};

// Reference images and general soft-water Caridina guidance for the preview.
// Replace with breeder-specific photos and parameters when adding real stock.
const parameters = [
  { label: "TDS", value: "100–200 ppm" },
  { label: "GH", value: "4–6 dGH" },
  { label: "KH", value: "0–2 dKH" },
  { label: "pH", value: "5.8–6.8" },
  { label: "Temperature", value: "20–23 °C" },
];

const redGalaxyImage = "https://tropicflow.com/cdn/shop/files/435254259_2119915755007567_710863787216825263_n.jpg?v=1747414126&width=1946";

export const shrimpDetails: Record<string, ShrimpDetails> = {
  "nebula-red-small-dot": {
    relatedImages: [redGalaxyImage],
    parameters,
    source: "https://www.horizonaquatics.co.uk/products/red-galaxy-shrimp",
    note: "General soft-water Caridina guidance. Confirm the exact range with your breeder. Gallery includes similar Red Galaxy reference photos.",
  },
  "red-galaxy-fishbone": {
    relatedImages: [redGalaxyImage],
    parameters,
    source: "https://www.horizonaquatics.co.uk/products/red-galaxy-shrimp",
    note: "Keep water conditions stable and use remineralised RO water. Gallery includes similar Red Galaxy reference photos.",
  },
  "red-devil-orange-eye": {
    relatedImages: ["https://teacherspetnw.com/cdn/shop/files/129B00B9-8C41-43A8-9F27-093D4BFFC3D1_1_105_c.webp?v=1736916663&width=1445"],
    parameters,
    source: "https://www.horizonaquatics.co.uk/products/red-galaxy-shrimp",
    note: "General soft-water Caridina guidance. Confirm the exact range with your breeder. Gallery includes a similar Orange Eye Devil reference photo.",
  },
};
