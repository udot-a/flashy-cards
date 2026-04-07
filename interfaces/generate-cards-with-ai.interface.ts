export interface GenerateCardsWithAiButtonProps {
  deckId: number;
  /** Whether the user may use AI generation (Pro plan or `ai_flashcard_generation` feature). */
  canUseAi: boolean;
  /** Deck must have a non-empty title and description (AI uses them as context). */
  deckReadyForAi: boolean;
}

export type GenerateCardsWithAiActionResult =
  | { ok: true; inserted: number }
  | { ok: false; message: string };
