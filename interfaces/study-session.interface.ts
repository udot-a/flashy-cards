import type { CardListRow } from "@/interfaces/flash-card.interface";
import type { DeckDetailRow } from "@/interfaces/deck.interface";

export type StudyCardGrade = "correct" | "incorrect";

export interface StudySessionProps {
  deck: DeckDetailRow;
  cards: CardListRow[];
}
