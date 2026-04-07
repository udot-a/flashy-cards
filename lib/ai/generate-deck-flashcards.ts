import { openai } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";

const CARD_COUNT = 20;

const flashcardsOutputSchema = z.object({
  cards: z
    .array(
      z.object({
        front: z.string(),
        back: z.string(),
      }),
    )
    .length(CARD_COUNT),
});

export type GeneratedCardPair = { front: string; back: string };

export async function generateFlashcardsForDeck(
  deckTitle: string,
  deckDescription: string | null,
): Promise<
  { ok: true; cards: GeneratedCardPair[] } | { ok: false; message: string }
> {
  const desc = deckDescription?.trim() ?? "";
  const prompt = `You are flashcard generation for spaced repetition.

Deck title: ${deckTitle}
${desc ? `Deck description:\n${desc}` : "No description was provided — infer the topic from the title only."}

Generate exactly ${CARD_COUNT} distinct flashcards that match the deck topic. Each card must have a concise front (question or prompt) and a clear back (answer). Cover different aspects of the topic; avoid duplicate questions.`;

  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      output: Output.object({
        schema: flashcardsOutputSchema,
        name: "flashcards",
        description: `Exactly ${CARD_COUNT} flashcards with front and back strings`,
      }),
      prompt,
    });

    const raw = result.output;
    if (!raw?.cards) {
      return {
        ok: false,
        message: "The model did not return flashcards in the expected format.",
      };
    }

    const cards = raw.cards.map((c) => ({
      front: c.front.trim().slice(0, 5000),
      back: c.back.trim().slice(0, 5000),
    }));

    for (const c of cards) {
      if (!c.front || !c.back) {
        return {
          ok: false,
          message: "The model returned an empty card side.",
        };
      }
    }

    return { ok: true, cards };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Flashcard generation failed.";
    return { ok: false, message };
  }
}
