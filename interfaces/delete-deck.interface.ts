import type { z } from "zod";

import { deleteDeckPayloadSchema } from "@/lib/validation/decks";

/** Parsed server-action payload after [deleteDeckPayloadSchema](mdc:lib/validation/decks.ts) validation. */
export type DeleteDeckPayload = z.infer<typeof deleteDeckPayloadSchema>;

export type DeleteDeckActionResult =
  | { ok: true }
  | { ok: false; message: string };

export interface DeleteDeckDialogProps {
  deckId: number;
  deckTitle: string;
}
