import type { z } from "zod";

import { updateCardPayloadSchema } from "@/lib/validation/cards";

/** Parsed server-action payload after [updateCardPayloadSchema](mdc:lib/validation/cards.ts) validation. */
export type UpdateCardPayload = z.infer<typeof updateCardPayloadSchema>;

export type CardUpdateFields = Pick<UpdateCardPayload, "front" | "back">;

export type UpdateCardActionResult =
  | { ok: true }
  | { ok: false; message: string };
