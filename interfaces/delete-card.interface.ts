import type { z } from "zod";

import { deleteCardPayloadSchema } from "@/lib/validation/cards";

/** Parsed server-action payload after [deleteCardPayloadSchema](mdc:lib/validation/cards.ts) validation. */
export type DeleteCardPayload = z.infer<typeof deleteCardPayloadSchema>;

export type DeleteCardActionResult =
  | { ok: true }
  | { ok: false; message: string };
