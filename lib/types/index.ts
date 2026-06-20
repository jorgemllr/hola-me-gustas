export interface CardData {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  isInteractive?: boolean;
  options?: string[];
}

export type SwipeDirection = "right" | "left";

export interface SwipeDecision {
  card: CardData;
  direction: SwipeDirection;
  selectedOption?: string;
}

export interface MatchRecord {
  card_id: string;
  card_title: string;
  category: string;
  selected_option?: string | null;
  matched: boolean;
  session_id: string;
  order_index: number;
}
