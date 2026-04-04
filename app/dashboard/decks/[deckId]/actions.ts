"use server";

import { auth } from "@clerk/nextjs/server";

import type { UpdateDeckActionResult } from "@/interfaces/update-deck.interface";
import { updateDeckForUser } from "@/lib/db/queries/decks";
import { updateDeckPayloadSchema } from "@/lib/validation/decks";

export async function updateDeckAction(
  input: unknown,
): Promise<UpdateDeckActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, message: "You must be signed in to edit a deck." };
  }

  const parsed = updateDeckPayloadSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { ok: false, message: first ?? "Invalid deck details." };
  }

  const { deckId, title, description } = parsed.data;
  const row = await updateDeckForUser(userId, deckId, { title, description });
  if (!row) {
    return {
      ok: false,
      message: "Deck not found or you don't have permission to edit it.",
    };
  }

  return { ok: true };
}
