"use client";

import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  RotateCw,
  Shuffle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type {
  StudyCardGrade,
  StudySessionProps,
} from "@/interfaces/study-session.interface";
import { cn } from "@/lib/utils";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Skip global shortcuts while typing or when Space should activate a control. */
function shouldIgnoreStudyKeydown(e: KeyboardEvent): boolean {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return false;
  if (t.isContentEditable) return true;
  const field = t.closest("input, textarea, select");
  if (field instanceof HTMLInputElement) {
    const type = field.type;
    if (
      type === "button" ||
      type === "submit" ||
      type === "reset" ||
      type === "checkbox" ||
      type === "radio" ||
      type === "file"
    ) {
      return false;
    }
    return true;
  }
  if (field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
    return true;
  }
  if (e.key === " " || e.key === "Spacebar") {
    const ae = document.activeElement;
    if (ae instanceof HTMLButtonElement) return true;
    if (ae instanceof HTMLAnchorElement && ae.hasAttribute("href")) return true;
  }
  return false;
}

export function StudySession({ deck, cards }: StudySessionProps) {
  const [order, setOrder] = useState(() => [...cards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [grades, setGrades] = useState<Map<number, StudyCardGrade>>(new Map());
  const [sessionComplete, setSessionComplete] = useState(false);

  const total = order.length;
  const currentCard = order[currentIndex];

  const correctCount = useMemo(
    () => [...grades.values()].filter((g) => g === "correct").length,
    [grades],
  );
  const incorrectCount = useMemo(
    () => [...grades.values()].filter((g) => g === "incorrect").length,
    [grades],
  );

  const progressPercent =
    total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleShuffle = useCallback(() => {
    setOrder(shuffleArray([...cards]));
    setCurrentIndex(0);
    setIsFlipped(false);
    setGrades(new Map());
    setSessionComplete(false);
  }, [cards]);

  const handlePrevious = useCallback(() => {
    if (currentIndex <= 0) return;
    setCurrentIndex((i) => i - 1);
    setIsFlipped(false);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex >= total - 1) {
      setSessionComplete(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setIsFlipped(false);
  }, [currentIndex, total]);

  const setGrade = useCallback((grade: StudyCardGrade) => {
    if (!currentCard) return;
    setGrades((prev) => new Map(prev).set(currentCard.id, grade));
  }, [currentCard]);

  const handleRestart = useCallback(() => {
    setOrder([...cards]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setGrades(new Map());
    setSessionComplete(false);
  }, [cards]);

  const handleStudyIncorrect = useCallback(() => {
    const wrong = order.filter((c) => grades.get(c.id) === "incorrect");
    if (wrong.length === 0) return;
    setOrder(shuffleArray(wrong));
    setCurrentIndex(0);
    setIsFlipped(false);
    setGrades(new Map());
    setSessionComplete(false);
  }, [order, grades]);

  useEffect(() => {
    if (sessionComplete || cards.length === 0) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (shouldIgnoreStudyKeydown(e)) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
        return;
      }
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        handleFlip();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    sessionComplete,
    cards.length,
    handlePrevious,
    handleNext,
    handleFlip,
  ]);

  if (cards.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-1 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{deck.title}</h1>
          <p className="text-muted-foreground">
            This deck has no cards yet. Add some cards before studying.
          </p>
        </div>
        <Button variant="outline" size="lg" asChild>
          <Link href={`/dashboard/decks/${deck.id}`}>
            <ArrowLeft data-icon="inline-start" />
            Back to Deck
          </Link>
        </Button>
      </main>
    );
  }

  if (sessionComplete) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-1">
        <Button variant="ghost" size="sm" className="-ms-2 w-fit" asChild>
          <Link href={`/dashboard/decks/${deck.id}`}>
            <ArrowLeft data-icon="inline-start" />
            Back to Deck
          </Link>
        </Button>

        <div className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Session complete
            </p>
            <p className="text-4xl font-bold tracking-tight">
              {correctCount} correct
              <span className="text-muted-foreground"> · </span>
              {incorrectCount} incorrect
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {incorrectCount > 0 && (
              <Button variant="outline" size="lg" onClick={handleStudyIncorrect}>
                <Shuffle className="size-4" />
                Study incorrect ({incorrectCount})
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={handleRestart}>
              <RefreshCw className="size-4" />
              Restart
            </Button>
            <Button size="lg" asChild>
              <Link href={`/dashboard/decks/${deck.id}`}>Done</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const currentGrade = currentCard ? grades.get(currentCard.id) : undefined;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-1 pb-8">
      <div className="flex flex-col gap-6">
        <Button variant="ghost" size="sm" className="-ms-2 w-fit" asChild>
          <Link href={`/dashboard/decks/${deck.id}`}>
            <ArrowLeft data-icon="inline-start" />
            Back to Deck
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {deck.title}
          </h1>
          <Button
            variant="outline"
            size="default"
            className="shrink-0 sm:mt-0.5"
            onClick={handleShuffle}
          >
            <Shuffle data-icon="inline-start" className="size-4" />
            Shuffle
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col justify-between gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <span>
            Card {currentIndex + 1} of {total}
          </span>
          <span>
            {correctCount} correct, {incorrectCount} incorrect
          </span>
        </div>
        <Progress value={progressPercent} className="h-2 rounded-full bg-muted" />
      </div>

      <div
        className="[perspective:1400px] min-h-[min(22rem,50vh)] w-full cursor-pointer"
        onClick={handleFlip}
        onKeyDown={
          isFlipped
            ? undefined
            : (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleFlip();
                }
              }
        }
        role={isFlipped ? undefined : "button"}
        tabIndex={isFlipped ? -1 : 0}
        aria-label={isFlipped ? undefined : "Reveal answer"}
      >
        <div
          className={cn(
            "relative h-full min-h-[min(22rem,50vh)] w-full transition-transform duration-500 [transform-style:preserve-3d]",
            isFlipped && "[transform:rotateY(180deg)]",
          )}
        >
          <div className="absolute inset-0 flex flex-col rounded-xl border border-border bg-card px-6 py-8 shadow-sm [backface-visibility:hidden]">
            <p className="text-center text-xs font-medium text-muted-foreground">
              Front
            </p>
            <div className="flex flex-1 items-center justify-center px-2 py-6">
              <p className="text-center text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                {currentCard.front}
              </p>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Click to reveal answer
            </p>
          </div>

          <div className="absolute inset-0 flex flex-col rounded-xl border border-border bg-card px-6 py-8 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="text-center text-xs font-medium text-muted-foreground">
              Back
            </p>
            <div className="flex flex-1 items-center justify-center px-2 py-6">
              <p className="text-center text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                {currentCard.back}
              </p>
            </div>
            <div
              className="flex flex-col gap-3"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    currentGrade === "correct" &&
                      "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400",
                  )}
                  onClick={() => setGrade("correct")}
                >
                  Correct
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    currentGrade === "incorrect" &&
                      "border-destructive/50 bg-destructive/10 text-destructive",
                  )}
                  onClick={() => setGrade("incorrect")}
                >
                  Incorrect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full border-border bg-background hover:bg-muted/80 dark:bg-input/30 dark:hover:bg-input/50"
          disabled={currentIndex <= 0}
          onClick={handlePrevious}
        >
          <ArrowLeft data-icon="inline-start" className="size-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full border-border bg-background hover:bg-muted/80 dark:bg-input/30 dark:hover:bg-input/50"
          onClick={(e) => {
            e.stopPropagation();
            handleFlip();
          }}
        >
          <RotateCw data-icon="inline-start" className="size-4" />
          Flip Card
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full border-border bg-background hover:bg-muted/80 dark:bg-input/30 dark:hover:bg-input/50"
          onClick={handleNext}
        >
          Next
          <ArrowRight data-icon="inline-end" className="size-4" />
        </Button>
      </div>
    </main>
  );
}
