import type { z } from "zod";

import { updateDeckPayloadSchema } from "@/lib/validation/decks";

/** Parsed server-action payload after [updateDeckPayloadSchema](mdc:lib/validation/decks.ts) validation. */
export type UpdateDeckPayload = z.infer<typeof updateDeckPayloadSchema>;

export type DeckUpdateFields = Pick<UpdateDeckPayload, "title" | "description">;

export type UpdateDeckActionResult =
  | { ok: true }
  | { ok: false; message: string };
