import { and, asc, eq } from "drizzle-orm";

import type { CardListRow } from "@/interfaces/flash-card.interface";
import { db } from "@/lib/db";
import { cards, decks } from "@/lib/db/schema";

export async function listCardsForOwnedDeck(
  clerkUserId: string,
  deckId: number,
): Promise<CardListRow[]> {
  return db
    .select({
      id: cards.id,
      front: cards.front,
      back: cards.back,
      createdAt: cards.createdAt,
      updatedAt: cards.updatedAt,
    })
    .from(cards)
    .innerJoin(decks, eq(cards.deckId, decks.id))
    .where(and(eq(cards.deckId, deckId), eq(decks.clerkUserId, clerkUserId)))
    .orderBy(asc(cards.id));
}
