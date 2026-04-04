import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Play, Plus, SquarePen } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
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
  const studyProgress = 0;

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

          <CardContent className="space-y-6 border-t border-border px-6 pt-6 pb-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-foreground">
                  Study Progress
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {studyProgress}%
                </span>
              </div>
              <Progress
                value={studyProgress}
                className="h-1.5 bg-muted"
                aria-label="Study progress"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <Button
                variant="default"
                size="lg"
                type="button"
                className="h-11 w-full sm:flex-1 sm:text-base"
              >
                <Play data-icon="inline-start" className="size-4" />
                Start Study Session
              </Button>
              <Button
                variant="outline"
                size="lg"
                type="button"
                className="h-11 w-full sm:w-auto sm:px-6 sm:text-base"
              >
                <Plus data-icon="inline-start" className="size-4" />
                Add Card
              </Button>
            </div>
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
            <Button
              variant="outline"
              size="default"
              type="button"
              className="w-full sm:w-auto"
            >
              <Plus data-icon="inline-start" />
              Add Card
            </Button>
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
                      <p className="text-xs text-muted-foreground">
                        Card #{index + 1}
                      </p>
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
                      <Button
                        variant="outline"
                        size="default"
                        type="button"
                        className="w-full"
                      >
                        <SquarePen data-icon="inline-start" />
                        Edit
                      </Button>
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
