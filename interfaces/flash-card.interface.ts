/** Row shape returned by [lib/db/queries/cards.ts](mdc:lib/db/queries/cards.ts) `listCardsForOwnedDeck`. */
export interface CardListRow {
  id: number;
  front: string;
  back: string;
  createdAt: Date;
  updatedAt: Date;
}
