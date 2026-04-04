import type { z } from "zod";

import { createCardPayloadSchema } from "@/lib/validation/cards";

/** Parsed server-action payload after [createCardPayloadSchema](mdc:lib/validation/cards.ts) validation. */
export type CreateCardPayload = z.infer<typeof createCardPayloadSchema>;

export type CreateCardActionResult =
  | { ok: true }
  | { ok: false; message: string };
