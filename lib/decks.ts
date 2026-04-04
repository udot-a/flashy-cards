import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { decks } from "@/lib/db/schema";

export async function listDecksForUser(clerkUserId: string) {
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
