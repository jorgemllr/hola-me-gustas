"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CardData } from "@/lib/types";

interface OptionsModalProps {
  card: CardData | null;
  isOpen: boolean;
  onSelect: (options: string[]) => void;
  onDismiss: () => void;
}

export default function OptionsModal({ card, isOpen, onSelect, onDismiss }: OptionsModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customText, setCustomText] = useState("");

  // Reset state whenever the modal opens for a new card
  useEffect(() => {
    if (isOpen) {
      setSelected(new Set());
      setCustomText("");
    }
  }, [isOpen, card?.id]);

  if (!card || !card.options) return null;

  const allowCustomInput = card.id === "interactive_music";

  function toggleOption(option: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      return next;
    });
  }

  function handleConfirm() {
    const result: string[] = [...selected];
    if (allowCustomInput && customText.trim()) {
      result.push(customText.trim());
    }
    if (result.length === 0) {
      // Must pick at least one
      return;
    }
    onSelect(result);
  }

  const hasSelection = selected.size > 0 || (allowCustomInput && customText.trim().length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
          />

          {/* Bottom sheet */}
          <motion.div
            key="sheet"
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#1c1c1e] rounded-t-[28px] px-6 pt-4"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 24px)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="w-12 h-1 rounded-full bg-[#3a3a3c] mx-auto mb-5" />

            {/* Header */}
            <div className="mb-4">
              <p className="text-[#F5C518] text-xs font-semibold tracking-widest uppercase mb-1">
                ¡Es un match! 💛
              </p>
              <h3 className="text-white text-xl font-bold leading-tight">
                {card.title}
              </h3>
              <p className="text-[#8e8e93] text-sm mt-1">
                Elige una o más opciones:
              </p>
            </div>

            {/* Options — multi-select checkboxes */}
            <div className="flex flex-col gap-2.5 mb-4">
              {card.options.map((option, i) => {
                const isChecked = selected.has(option);
                return (
                  <motion.button
                    key={option}
                    id={`option-btn-${card.id}-${i}`}
                    onClick={() => toggleOption(option)}
                    className="w-full text-left px-4 py-3.5 rounded-2xl border flex items-center gap-3 transition-all active:scale-[0.98]"
                    style={{
                      background: isChecked
                        ? "rgba(245,197,24,0.1)"
                        : "rgba(44,44,46,1)",
                      borderColor: isChecked
                        ? "rgba(245,197,24,0.6)"
                        : "rgba(58,58,60,1)",
                    }}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {/* Checkbox */}
                    <motion.div
                      className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0"
                      style={{
                        borderColor: isChecked ? "#F5C518" : "#3a3a3c",
                        backgroundColor: isChecked ? "#F5C518" : "transparent",
                      }}
                      animate={{ scale: isChecked ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isChecked && (
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path
                            d="M1 4L4 7.5L10 1"
                            stroke="#111111"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </motion.div>

                    <span className="text-white font-medium text-sm leading-snug flex-1">
                      {option}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Custom text input — only for music card */}
            {allowCustomInput && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <p className="text-[#8e8e93] text-xs font-medium mb-2 tracking-wide uppercase">
                  Otra recomendación
                </p>
                <input
                  id="music-custom-input"
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Escribe aquí tu playlist o artista..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#2c2c2e] border border-[#3a3a3c] text-white text-sm placeholder-[#555] outline-none focus:border-[#F5C518]/50 transition-colors"
                  style={{ WebkitUserSelect: "auto", userSelect: "auto" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(245,197,24,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "#3a3a3c")}
                />
              </motion.div>
            )}

            {/* Confirm button */}
            <motion.button
              id="options-confirm-btn"
              onClick={handleConfirm}
              disabled={!hasSelection}
              className="w-full py-4 rounded-2xl font-bold text-base transition-all mb-2"
              style={{
                background: hasSelection
                  ? "linear-gradient(135deg, #F5C518, #FFD700)"
                  : "rgba(44,44,46,0.5)",
                color: hasSelection ? "#111111" : "#555",
                boxShadow: hasSelection
                  ? "0 4px 20px rgba(245,197,24,0.3)"
                  : "none",
              }}
              whileTap={hasSelection ? { scale: 0.97 } : {}}
              animate={{
                opacity: hasSelection ? 1 : 0.4,
              }}
            >
              Confirmar selección{selected.size > 1 ? ` (${selected.size})` : ""}
            </motion.button>

            {/* Skip */}
            <button
              id="option-skip-btn"
              onClick={onDismiss}
              className="w-full text-center text-[#8e8e93] text-sm py-2"
            >
              Omitir
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
