import { z } from "zod";

export const createAquariumSchema = z.object({
  name: z.string().trim().min(1).max(120),
  type: z.string().trim().min(1).max(50),
  volumeLitres: z.number().positive(),
  ph: z.number().min(0).max(14).nullable().optional(),
  gh: z.number().nonnegative().nullable().optional(),
  tds: z.number().nonnegative().nullable().optional(),
});

export const updateAquariumSchema = createAquariumSchema.partial().refine(
  (input) => Object.keys(input).length > 0,
  "At least one field is required",
);

export type CreateAquariumInput = z.infer<typeof createAquariumSchema>;
export type UpdateAquariumInput = z.infer<typeof updateAquariumSchema>;
