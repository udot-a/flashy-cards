/** Row shape returned by [lib/db/queries/decks.ts](mdc:lib/db/queries/decks.ts) `listDecksForUser`. */
export interface DeckListRow {
  id: number;
  title: string;
  description: string | null;
  updatedAt: Date;
}

/** Row shape returned by `getDeckForUser` (defined row, not undefined). */
export interface DeckDetailRow {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
