import { and, desc, eq } from "drizzle-orm";

import type { CardListRow } from "@/interfaces/flash-card.interface";
import type { CardUpdateFields } from "@/interfaces/update-card.interface";
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
    .orderBy(desc(cards.createdAt), desc(cards.id));
}

export async function insertCardForOwnedDeck(
  clerkUserId: string,
  deckId: number,
  fields: CardUpdateFields,
): Promise<{ id: number } | undefined> {
  const owned = await db
    .select({ id: decks.id })
    .from(decks)
    .where(and(eq(decks.id, deckId), eq(decks.clerkUserId, clerkUserId)))
    .limit(1);

  if (!owned[0]) {
    return undefined;
  }

  const rows = await db
    .insert(cards)
    .values({
      deckId,
      front: fields.front,
      back: fields.back,
    })
    .returning({ id: cards.id });

  return rows[0];
}

export async function insertManyCardsForOwnedDeck(
  clerkUserId: string,
  deckId: number,
  items: CardUpdateFields[],
): Promise<{ inserted: number } | undefined> {
  if (items.length === 0) {
    return undefined;
  }

  const owned = await db
    .select({ id: decks.id })
    .from(decks)
    .where(and(eq(decks.id, deckId), eq(decks.clerkUserId, clerkUserId)))
    .limit(1);

  if (!owned[0]) {
    return undefined;
  }

  await db.insert(cards).values(
    items.map((fields) => ({
      deckId,
      front: fields.front,
      back: fields.back,
    })),
  );

  return { inserted: items.length };
}

export async function updateCardForOwnedDeck(
  clerkUserId: string,
  deckId: number,
  cardId: number,
  fields: CardUpdateFields,
): Promise<{ id: number } | undefined> {
  const match = await db
    .select({ id: cards.id })
    .from(cards)
    .innerJoin(decks, eq(cards.deckId, decks.id))
    .where(
      and(
        eq(cards.id, cardId),
        eq(cards.deckId, deckId),
        eq(decks.clerkUserId, clerkUserId),
      ),
    )
    .limit(1);

  if (!match[0]) {
    return undefined;
  }

  const rows = await db
    .update(cards)
    .set({
      front: fields.front,
      back: fields.back,
      updatedAt: new Date(),
    })
    .where(eq(cards.id, cardId))
    .returning({ id: cards.id });

  return rows[0];
}

export async function deleteCardForOwnedDeck(
  clerkUserId: string,
  deckId: number,
  cardId: number,
): Promise<boolean> {
  const match = await db
    .select({ id: cards.id })
    .from(cards)
    .innerJoin(decks, eq(cards.deckId, decks.id))
    .where(
      and(
        eq(cards.id, cardId),
        eq(cards.deckId, deckId),
        eq(decks.clerkUserId, clerkUserId),
      ),
    )
    .limit(1);

  if (!match[0]) {
    return false;
  }

  await db.delete(cards).where(eq(cards.id, cardId));
  return true;
}
