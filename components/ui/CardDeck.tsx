"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CardData } from "@/lib/types";
import SwipeCard from "./SwipeCard";

interface CardDeckProps {
  cards: CardData[];
  onSwipeLeft: (card: CardData) => void;
  onSwipeRight: (card: CardData) => void;
}

// Show at most 3 background cards for performance
const VISIBLE_COUNT = 3;

export default function CardDeck({ cards, onSwipeLeft, onSwipeRight }: CardDeckProps) {
  const visibleCards = cards.slice(0, VISIBLE_COUNT);

  return (
    <div className="relative flex-1 w-full flex items-center justify-center" role="region" aria-label="Card deck">
      <AnimatePresence mode="sync">
        {visibleCards.map((card, index) => {
          const isTop = index === 0;
          const stackOffset = index; // 0 = top, 1 = second, 2 = third

          return (
            <motion.div
              key={card.id}
              className="absolute inset-0 flex items-center justify-center"
              initial={
                isTop
                  ? { scale: 0.9, opacity: 0, y: -30 }
                  : undefined
              }
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={
                isTop
                  ? {}
                  : undefined
              }
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ zIndex: VISIBLE_COUNT - index }}
            >
              <SwipeCard
                card={card}
                isTop={isTop}
                zIndex={VISIBLE_COUNT - index}
                stackOffset={stackOffset}
                onSwipeLeft={() => onSwipeLeft(card)}
                onSwipeRight={() => onSwipeRight(card)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Empty state when deck is loading or transitioning */}
      {cards.length === 0 && (
        <div className="w-[min(88vw,360px)] h-[min(70vh,580px)] rounded-[24px] border border-[#3a3a3c] bg-[#1c1c1e]/50 flex items-center justify-center">
          <div className="text-[#8e8e93] text-sm">Cargando...</div>
        </div>
      )}
    </div>
  );
}
