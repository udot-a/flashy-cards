import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Play } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddCardDialog } from "@/app/dashboard/decks/[deckId]/add-card-dialog";
import { DeleteCardDialog } from "@/app/dashboard/decks/[deckId]/delete-card-dialog";
import { EditCardDialog } from "@/app/dashboard/decks/[deckId]/edit-card-dialog";
import { EditDeckDialog } from "@/app/dashboard/decks/[deckId]/edit-deck-dialog";
import type { DeckPageProps } from "@/interfaces/deck-page.interface";
import { listCardsForOwnedDeck } from "@/lib/db/queries/cards";
import { getDeckForUser } from "@/lib/db/queries/decks";

function parseDeckId(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) {
    return null;
  }
  return n;
}

function formatCreatedDate(value: Date) {
  return value.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: DeckPageProps): Promise<Metadata> {
  const { deckId: raw } = await params;
  const deckId = parseDeckId(raw);
  if (deckId === null) {
    return { title: "Deck" };
  }

  const { userId } = await auth();
  if (!userId) {
    return { title: "Deck" };
  }

  const deck = await getDeckForUser(userId, deckId);
  if (!deck) {
    return { title: "Deck" };
  }

  return { title: deck.title };
}

export default async function DeckPage({ params }: DeckPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const { deckId: raw } = await params;
  const deckId = parseDeckId(raw);
  if (deckId === null) {
    notFound();
  }

  const deck = await getDeckForUser(userId, deckId);
  if (!deck) {
    notFound();
  }

  const cardList = await listCardsForOwnedDeck(userId, deckId);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 py-8">
      <main className="mx-auto w-full max-w-6xl">
        <Button variant="ghost" size="sm" className="-ms-2 mb-6" asChild>
          <Link href="/dashboard">
            <ArrowLeft data-icon="inline-start" />
            Back to dashboard
          </Link>
        </Button>

        <Card className="gap-0 rounded-xl border border-border bg-card py-0 shadow-none ring-1 ring-foreground/10">
          <CardHeader className="flex flex-col gap-6 space-y-0 px-6 pt-6 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <CardTitle className="font-heading text-2xl font-semibold leading-tight tracking-tight text-card-foreground sm:text-3xl">
                {deck.title}
              </CardTitle>
              {deck.description?.trim() ? (
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {deck.description.trim()}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-lg font-normal">
                  {cardList.length}{" "}
                  {cardList.length === 1 ? "card" : "cards"}
                </Badge>
                <Badge variant="secondary" className="rounded-lg font-normal">
                  Created {formatCreatedDate(deck.createdAt)}
                </Badge>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
              <EditDeckDialog
                deckId={deck.id}
                defaultTitle={deck.title}
                defaultDescription={deck.description}
              />
            </div>
          </CardHeader>

          <CardContent className="border-t border-border px-6 pt-6 pb-6">
            <Button
              variant="default"
              size="lg"
              className="h-11 w-full sm:text-base"
              asChild
            >
              <Link href={`/dashboard/decks/${deck.id}/study`}>
                <Play data-icon="inline-start" className="size-4" />
                Start Study Session
              </Link>
            </Button>
          </CardContent>
        </Card>

        <section
          className="mt-10"
          aria-labelledby="deck-cards-heading"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2
              id="deck-cards-heading"
              className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              Cards
            </h2>
            <AddCardDialog deckId={deck.id} />
          </div>

          {cardList.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No cards in this deck yet. Add a card to get started.
            </p>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cardList.map((card, index) => (
                <li key={card.id}>
                  <Card className="h-full gap-0 rounded-xl border border-border bg-card py-0 shadow-none ring-1 ring-foreground/10">
                    <CardHeader className="space-y-4 px-5 pt-5 pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-muted-foreground">
                          Card #{index + 1}
                        </p>
                        <DeleteCardDialog
                          deckId={deck.id}
                          cardId={card.id}
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-foreground">
                          Front
                        </p>
                        <div
                          className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm leading-relaxed text-card-foreground dark:bg-black/35"
                          data-readonly-field
                        >
                          {card.front}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-foreground">
                          Back
                        </p>
                        <div
                          className="rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm leading-relaxed text-card-foreground dark:bg-black/35"
                          data-readonly-field
                        >
                          {card.back}
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex flex-col rounded-b-xl border-t border-border bg-transparent px-5 pt-4 pb-5">
                      <EditCardDialog
                        deckId={deck.id}
                        cardId={card.id}
                        defaultFront={card.front}
                        defaultBack={card.back}
                      />
                    </CardFooter>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
