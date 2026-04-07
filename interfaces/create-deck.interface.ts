import type { z } from "zod";

import { createDeckPayloadSchema } from "@/lib/validation/decks";

/** Parsed server-action payload after [createDeckPayloadSchema](mdc:lib/validation/decks.ts) validation. */
export type CreateDeckPayload = z.infer<typeof createDeckPayloadSchema>;

export type CreateDeckActionResult =
  | { ok: true; deckId: number }
  | { ok: false; message: string };
