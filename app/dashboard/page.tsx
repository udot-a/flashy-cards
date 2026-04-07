import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";

import { CreateDeckDialog } from "@/app/dashboard/create-deck-dialog";
import { DeleteDeckDialog } from "@/app/dashboard/delete-deck-dialog";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FREE_PLAN_DECK_LIMIT } from "@/lib/billing";
import { listDecksForUser } from "@/lib/db/queries/decks";

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
  const { userId, has } = await auth();
  if (!userId) {
    return null;
  }

  const deckList = await listDecksForUser(userId);
  const canCreateDeck =
    has({ feature: "unlimited_decks" }) ||
    deckList.length < FREE_PLAN_DECK_LIMIT;

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
                <Card className="relative h-full gap-0 rounded-2xl border border-border bg-card py-0 ring-0 transition-colors hover:bg-muted/30 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                  <div className="absolute end-3 top-3 z-10">
                    <DeleteDeckDialog deckId={deck.id} deckTitle={deck.title} />
                  </div>
                  <Link
                    href={`/dashboard/decks/${deck.id}`}
                    className="block h-full rounded-2xl outline-none"
                  >
                    <CardHeader className="space-y-2 px-6 pt-6 pe-14 pb-5">
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
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <CreateDeckDialog canCreateDeck={canCreateDeck} />
        </div>
      </main>
    </div>
  );
}
