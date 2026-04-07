import { z } from "zod";

const cardSideSchema = z
  .string()
  .trim()
  .min(1, "This field is required")
  .max(5000, "Must be at most 5000 characters");

/** Client + shared field rules (react-hook-form + server merge). */
export const cardFormSchema = z.object({
  front: cardSideSchema,
  back: cardSideSchema,
});

export const createCardPayloadSchema = cardFormSchema.extend({
  deckId: z.number().int().positive(),
});

export const updateCardPayloadSchema = cardFormSchema.extend({
  deckId: z.number().int().positive(),
  cardId: z.number().int().positive(),
});

export const deleteCardPayloadSchema = z.object({
  deckId: z.number().int().positive(),
  cardId: z.number().int().positive(),
});

export const generateCardsWithAiPayloadSchema = z.object({
  deckId: z.number().int().positive(),
});
