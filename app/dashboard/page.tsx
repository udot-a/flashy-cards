import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
                <Card className="h-full py-0">
                  <CardHeader className="gap-3 px-6 pb-4 pt-6">
                    <CardTitle className="text-lg leading-snug font-semibold text-card-foreground">
                      {deck.title}
                    </CardTitle>
                    <CardAction>
                      <Badge variant="secondary" className="font-normal">
                        {formatDeckDate(deck.createdAt)}
                      </Badge>
                    </CardAction>
                    <CardDescription className="text-sm leading-relaxed">
                      {deck.description?.trim()
                        ? deck.description
                        : "No description yet."}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="justify-between gap-3 border-border px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      Ready to study
                    </span>
                    <Button variant="default" size="sm" asChild>
                      <Link href={`/dashboard/decks/${deck.id}`}>Study</Link>
                    </Button>
                  </CardFooter>
                </Card>
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
