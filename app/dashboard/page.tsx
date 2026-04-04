import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listDecksForUser } from "@/lib/decks";

export const metadata: Metadata = {
  title: "Dashboard",
};

function formatDeckDate(value: Date) {
  return value.toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const deckList = await listDecksForUser(userId);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 py-8">
      <main className="mx-auto w-full max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your flashcard decks here.
        </p>

        {deckList.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            No decks yet. Create your first deck below.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {deckList.map((deck) => (
              <li key={deck.id}>
                <Link
                  href={`/dashboard/decks/${deck.id}`}
                  className="group/deck-card block h-full rounded-2xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="h-full gap-0 rounded-2xl border border-border bg-card py-0 ring-0 transition-colors group-hover/deck-card:bg-muted/30 group-focus-visible/deck-card:bg-muted/30">
                    <CardHeader className="space-y-2 px-6 pt-6 pb-5">
                      <CardTitle className="text-xl font-bold leading-snug tracking-tight text-card-foreground">
                        {deck.title}
                      </CardTitle>
                      {deck.description?.trim() ? (
                        <CardDescription className="text-base leading-relaxed text-muted-foreground">
                          {deck.description.trim()}
                        </CardDescription>
                      ) : null}
                    </CardHeader>
                    <CardFooter className="justify-start border-t border-border bg-transparent px-6 py-4 text-sm leading-normal text-muted-foreground">
                      Last updated: {formatDeckDate(deck.updatedAt)}
                    </CardFooter>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <Button variant="default" size="lg" asChild>
            <Link href="/dashboard/decks/new">
              <Plus data-icon="inline-start" />
              Create a New Deck
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
