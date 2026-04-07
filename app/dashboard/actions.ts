"use server";

import { auth } from "@clerk/nextjs/server";

import type { CreateDeckActionResult } from "@/interfaces/create-deck.interface";
import type { DeleteDeckActionResult } from "@/interfaces/delete-deck.interface";
import { FREE_PLAN_DECK_LIMIT } from "@/lib/billing";
import {
  countDecksForUser,
  deleteDeckForUser,
  insertDeckForUser,
} from "@/lib/db/queries/decks";
import {
  createDeckPayloadSchema,
  deleteDeckPayloadSchema,
} from "@/lib/validation/decks";

export async function createDeckAction(
  input: unknown,
): Promise<CreateDeckActionResult> {
  const { userId, has } = await auth();
  if (!userId) {
    return { ok: false, message: "You must be signed in to create a deck." };
  }

  if (!has({ feature: "unlimited_decks" })) {
    const deckCount = await countDecksForUser(userId);
    if (deckCount >= FREE_PLAN_DECK_LIMIT) {
      return {
        ok: false,
        message: `The free plan is limited to ${FREE_PLAN_DECK_LIMIT} decks. Upgrade to create more.`,
      };
    }
  }

  const parsed = createDeckPayloadSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { ok: false, message: first ?? "Invalid deck details." };
  }

  const row = await insertDeckForUser(userId, parsed.data);
  if (!row) {
    return { ok: false, message: "Couldn't create deck. Try again." };
  }

  return { ok: true, deckId: row.id };
}

export async function deleteDeckAction(
  input: unknown,
): Promise<DeleteDeckActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, message: "You must be signed in to delete a deck." };
  }

  const parsed = deleteDeckPayloadSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { ok: false, message: first ?? "Invalid request." };
  }

  const deleted = await deleteDeckForUser(userId, parsed.data.deckId);
  if (!deleted) {
    return {
      ok: false,
      message: "Deck not found or you don't have permission to delete it.",
    };
  }

  return { ok: true };
}
