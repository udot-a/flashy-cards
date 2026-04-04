import { z } from "zod";

/** Client + shared field rules (react-hook-form + server merge). */
export const editDeckFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters"),
});

export const updateDeckPayloadSchema = editDeckFormSchema
  .extend({
    deckId: z.number().int().positive(),
  })
  .transform((data) => ({
    deckId: data.deckId,
    title: data.title,
    description:
      data.description.trim() === "" ? null : data.description.trim(),
  }));
