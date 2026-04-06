"use server";

import { auth } from "@clerk/nextjs/server";

import type { CreateCardActionResult } from "@/interfaces/create-card.interface";
import type { DeleteCardActionResult } from "@/interfaces/delete-card.interface";
import type { UpdateCardActionResult } from "@/interfaces/update-card.interface";
import type { UpdateDeckActionResult } from "@/interfaces/update-deck.interface";
import {
  deleteCardForOwnedDeck,
  insertCardForOwnedDeck,
  updateCardForOwnedDeck,
} from "@/lib/db/queries/cards";
import { updateDeckForUser } from "@/lib/db/queries/decks";
import {
  createCardPayloadSchema,
  deleteCardPayloadSchema,
  updateCardPayloadSchema,
} from "@/lib/validation/cards";
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

export async function createCardAction(
  input: unknown,
): Promise<CreateCardActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, message: "You must be signed in to add a card." };
  }

  const parsed = createCardPayloadSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { ok: false, message: first ?? "Invalid card details." };
  }

  const { deckId, front, back } = parsed.data;
  const row = await insertCardForOwnedDeck(userId, deckId, { front, back });
  if (!row) {
    return {
      ok: false,
      message: "Deck not found or you don't have permission to add cards.",
    };
  }

  return { ok: true };
}

export async function updateCardAction(
  input: unknown,
): Promise<UpdateCardActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, message: "You must be signed in to edit a card." };
  }

  const parsed = updateCardPayloadSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { ok: false, message: first ?? "Invalid card details." };
  }

  const { deckId, cardId, front, back } = parsed.data;
  const row = await updateCardForOwnedDeck(userId, deckId, cardId, {
    front,
    back,
  });
  if (!row) {
    return {
      ok: false,
      message: "Card not found or you don't have permission to edit it.",
    };
  }

  return { ok: true };
}

export async function deleteCardAction(
  input: unknown,
): Promise<DeleteCardActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false, message: "You must be signed in to delete a card." };
  }

  const parsed = deleteCardPayloadSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { ok: false, message: first ?? "Invalid request." };
  }

  const { deckId, cardId } = parsed.data;
  const deleted = await deleteCardForOwnedDeck(userId, deckId, cardId);
  if (!deleted) {
    return {
      ok: false,
      message: "Card not found or you don't have permission to delete it.",
    };
  }

  return { ok: true };
}
