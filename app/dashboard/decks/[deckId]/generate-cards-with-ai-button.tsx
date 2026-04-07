"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { generateCardsWithAiAction } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GenerateCardsWithAiButtonProps } from "@/interfaces/generate-cards-with-ai.interface";

export function GenerateCardsWithAiButton({
  deckId,
  canUseAi,
  deckReadyForAi,
}: GenerateCardsWithAiButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!canUseAi) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary" asChild className="w-full sm:w-auto">
            <Link href="/pricing">
              <Sparkles data-icon="inline-start" className="size-4" />
              Generate cards with AI
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-balance">
          AI flashcard generation is a paid feature. Click to open pricing and
          upgrade.
        </TooltipContent>
      </Tooltip>
    );
  }

  if (!deckReadyForAi) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex w-full cursor-not-allowed sm:w-auto">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              disabled
            >
              <Sparkles data-icon="inline-start" className="size-4" />
              Generate cards with AI
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-balance">
          Add a description to this deck first (use Edit deck). AI generation
          uses the title and description as context.
        </TooltipContent>
      </Tooltip>
    );
  }

  const generateButton = (
    <Button
      type="button"
      variant="secondary"
      className="w-full sm:w-auto"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const toastId = toast.loading("Generating flashcards…", {
            description: "This may take a moment.",
          });
          const result = await generateCardsWithAiAction({ deckId });
          if (result.ok) {
            toast.success("Cards generated", {
              id: toastId,
              description: `Added ${result.inserted} card${
                result.inserted === 1 ? "" : "s"
              } to this deck.`,
            });
            router.refresh();
            return;
          }
          toast.error("Couldn't generate cards", {
            id: toastId,
            description: result.message,
          });
        });
      }}
    >
      <Sparkles data-icon="inline-start" className="size-4" />
      {isPending ? "Generating…" : "Generate cards with AI"}
    </Button>
  );

  if (isPending) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex w-full cursor-wait sm:w-auto">
            {generateButton}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-balance">
          Generating flashcards — please wait. This can take a little while.
        </TooltipContent>
      </Tooltip>
    );
  }

  return generateButton;
}
