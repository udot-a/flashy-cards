import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StudySession } from "@/app/dashboard/decks/[deckId]/study/study-session";
import type { DeckPageProps } from "@/interfaces/deck-page.interface";
import { listCardsForOwnedDeck } from "@/lib/db/queries/cards";
import { getDeckForUser } from "@/lib/db/queries/decks";

function parseDeckId(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) return null;
  return n;
}

export async function generateMetadata({
  params,
}: DeckPageProps): Promise<Metadata> {
  const { deckId: raw } = await params;
  const deckId = parseDeckId(raw);
  if (deckId === null) return { title: "Study" };

  const { userId } = await auth();
  if (!userId) return { title: "Study" };

  const deck = await getDeckForUser(userId, deckId);
  if (!deck) return { title: "Study" };

  return { title: `Study – ${deck.title}` };
}

export default async function StudyPage({ params }: DeckPageProps) {
  const { userId } = await auth();
  if (!userId) return null;

  const { deckId: raw } = await params;
  const deckId = parseDeckId(raw);
  if (deckId === null) notFound();

  const deck = await getDeckForUser(userId, deckId);
  if (!deck) notFound();

  const cards = await listCardsForOwnedDeck(userId, deckId);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background px-4 py-8 sm:px-8 sm:py-10">
      <StudySession deck={deck} cards={cards} />
    </div>
  );
}
