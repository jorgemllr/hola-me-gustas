"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import CardDeck from "@/components/ui/CardDeck";
import SwipeOverlay from "@/components/ui/SwipeOverlay";
import OptionsModal from "@/components/ui/OptionsModal";
import UndoButton from "@/components/ui/UndoButton";
import EndScreen from "@/components/ui/EndScreen";
import WelcomeScreen from "@/components/ui/WelcomeScreen";
import { CARDS } from "@/lib/data/cards";
import { saveMatch } from "@/lib/actions/saveMatch";
import type { CardData, SwipeDecision } from "@/lib/types";

type OverlayMessage = "match" | "miss" | null;

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [cards, setCards] = useState<CardData[]>([...CARDS]);
  const [history, setHistory] = useState<SwipeDecision[]>([]);
  const [overlay, setOverlay] = useState<OverlayMessage>(null);
  const [interactiveCard, setInteractiveCard] = useState<CardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showOverlay = useCallback((type: OverlayMessage) => {
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    setOverlay(type);
    overlayTimerRef.current = setTimeout(() => setOverlay(null), 1000);
  }, []);

  const removeTopCard = useCallback(() => {
    setCards((prev) => {
      const next = prev.slice(1);
      if (next.length === 0) {
        setIsDone(true);
      }
      return next;
    });
  }, []);

  const handleSwipeRight = useCallback(
    (card: CardData) => {
      if (card.isInteractive) {
        setInteractiveCard(card);
        setIsModalOpen(true);
      } else {
        const decision: SwipeDecision = { card, direction: "right" };
        setHistory((prev) => [...prev, decision]);
        removeTopCard();
        showOverlay("match");
        saveMatch({
          card_id: card.id,
          card_title: card.title,
          category: card.category,
          selected_option: null,
          matched: true,
        });
      }
    },
    [removeTopCard, showOverlay]
  );

  const handleSwipeLeft = useCallback(
    (card: CardData) => {
      const decision: SwipeDecision = { card, direction: "left" };
      setHistory((prev) => [...prev, decision]);
      removeTopCard();
      saveMatch({
        card_id: card.id,
        card_title: card.title,
        category: card.category,
        selected_option: null,
        matched: false,
      });
    },
    [removeTopCard]
  );

  // Now accepts string[] from multi-select modal
  const handleOptionSelect = useCallback(
    (options: string[]) => {
      if (!interactiveCard) return;
      const selectedOption = options.join(", ");
      const decision: SwipeDecision = {
        card: interactiveCard,
        direction: "right",
        selectedOption,
      };
      setHistory((prev) => [...prev, decision]);
      setIsModalOpen(false);
      setInteractiveCard(null);
      removeTopCard();
      showOverlay("match");
      saveMatch({
        card_id: interactiveCard.id,
        card_title: interactiveCard.title,
        category: interactiveCard.category,
        selected_option: selectedOption,
        matched: true,
      });
    },
    [interactiveCard, removeTopCard, showOverlay]
  );

  const handleModalDismiss = useCallback(() => {
    if (!interactiveCard) return;
    const decision: SwipeDecision = { card: interactiveCard, direction: "left" };
    setHistory((prev) => [...prev, decision]);
    setIsModalOpen(false);
    setInteractiveCard(null);
    removeTopCard();
    saveMatch({
      card_id: interactiveCard.id,
      card_title: interactiveCard.title,
      category: interactiveCard.category,
      selected_option: null,
      matched: false,
    });
  }, [interactiveCard, removeTopCard]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const lastDecision = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCards((prev) => [lastDecision.card, ...prev]);
    setIsDone(false);
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    setOverlay(null);
  }, [history]);

  const totalCards = CARDS.length;
  const swipedCount = totalCards - cards.length;
  const progressPercent = (swipedCount / totalCards) * 100;

  return (
    <>
      {/* Welcome screen — sits above everything until dismissed */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeScreen onStart={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      <main className="flex flex-col h-dvh h-screen max-h-screen overflow-hidden relative">
        {/* Header */}
        <Header />

        {/* Progress bar */}
        <AnimatePresence>
          {!isDone && (
            <div className="px-6 pb-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#8e8e93] text-[11px] font-medium">
                  {swipedCount}/{totalCards} opciones
                </span>
                <span className="text-[#8e8e93] text-[11px]">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-[#2c2c2e] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #F5C518, #FFD700)",
                    boxShadow: "0 0 8px rgba(245,197,24,0.5)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Main area */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-0">
          <AnimatePresence mode="wait">
            {isDone ? (
              <motion.div
                key="end"
                className="flex-1 flex flex-col items-center justify-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <EndScreen />
              </motion.div>
            ) : (
              <motion.div
                key="deck"
                className="flex-1 flex flex-col items-stretch w-full min-h-0"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardDeck
                  cards={cards}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swipe overlay */}
          <SwipeOverlay message={overlay} />
        </div>

        {/* Bottom controls */}
        <AnimatePresence>
          {!isDone && (
            <motion.div
              className="flex flex-col items-center pb-6 pt-3 gap-3"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-6 px-8">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full border border-[#ff453a]/50 flex items-center justify-center text-sm">
                    ✕
                  </div>
                  <span className="text-[#8e8e93] text-xs">Nope</span>
                </div>

                <UndoButton onUndo={handleUndo} disabled={history.length === 0} />

                <div className="flex items-center gap-1.5">
                  <span className="text-[#8e8e93] text-xs">Match</span>
                  <div className="w-7 h-7 rounded-full border border-[#30d158]/50 flex items-center justify-center text-sm">
                    💛
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive options modal */}
        <OptionsModal
          card={interactiveCard}
          isOpen={isModalOpen}
          onSelect={handleOptionSelect}
          onDismiss={handleModalDismiss}
        />
      </main>
    </>
  );
}
