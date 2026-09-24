import { z } from "zod";

export const createShrimpSchema = z.object({
  name: z.string().trim().min(1),
  category: z.string().trim().min(1),
  imageURL: z.url(),
  description: z.string().trim(),
});

export type CreateShrimpInput = z.infer<typeof createShrimpSchema>;
