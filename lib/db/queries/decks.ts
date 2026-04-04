import { and, desc, eq } from "drizzle-orm";

import type {
  DeckDetailRow,
  DeckListRow,
} from "@/interfaces/deck.interface";
import type { DeckUpdateFields } from "@/interfaces/update-deck.interface";
import { db } from "@/lib/db";
import { decks } from "@/lib/db/schema";

export async function listDecksForUser(
  clerkUserId: string,
): Promise<DeckListRow[]> {
  return db
    .select({
      id: decks.id,
      title: decks.title,
      description: decks.description,
      updatedAt: decks.updatedAt,
    })
    .from(decks)
    .where(eq(decks.clerkUserId, clerkUserId))
    .orderBy(desc(decks.updatedAt));
}

export async function getDeckForUser(
  clerkUserId: string,
  deckId: number,
): Promise<DeckDetailRow | undefined> {
  const rows = await db
    .select({
      id: decks.id,
      title: decks.title,
      description: decks.description,
      createdAt: decks.createdAt,
      updatedAt: decks.updatedAt,
    })
    .from(decks)
    .where(and(eq(decks.id, deckId), eq(decks.clerkUserId, clerkUserId)))
    .limit(1);

  return rows[0];
}

export async function updateDeckForUser(
  clerkUserId: string,
  deckId: number,
  data: DeckUpdateFields,
) {
  const rows = await db
    .update(decks)
    .set({
      title: data.title,
      description: data.description,
      updatedAt: new Date(),
    })
    .where(and(eq(decks.id, deckId), eq(decks.clerkUserId, clerkUserId)))
    .returning({ id: decks.id });

  return rows[0];
}
