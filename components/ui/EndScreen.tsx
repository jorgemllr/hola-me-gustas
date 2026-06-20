"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveExtraSuggestion } from "@/lib/actions/saveMatch";

export default function EndScreen() {
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await saveExtraSuggestion(suggestion.trim());
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8">
      <motion.div
        className="text-center max-w-xs w-full"
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.1 }}
      >
        {/* Animated heart */}
        <motion.div
          className="text-6xl mb-6 block"
          animate={{
            scale: [1, 1.15, 1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut",
          }}
        >
          💛
        </motion.div>

        {/* Card */}
        <div
          className="rounded-3xl p-6 border text-left"
          style={{
            background:
              "linear-gradient(135deg, rgba(28,28,30,0.95) 0%, rgba(36,34,20,0.95) 100%)",
            borderColor: "rgba(245,197,24,0.25)",
            boxShadow:
              "0 0 60px rgba(245,197,24,0.08), 0 24px 48px rgba(0,0,0,0.5)",
          }}
        >
          <p
            className="font-bold text-xl leading-snug mb-3 text-center"
            style={{
              background:
                "linear-gradient(135deg, #FFD700 0%, #F5C518 50%, #d4a017 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Prepárate para mañana, Mariana.
          </p>

          <p className="text-white/80 text-base leading-relaxed text-center mb-4">
            Nos lo vamos a pasar muy bien. 🌿
          </p>

          {/* Divider */}
          <div className="h-px bg-[#F5C518]/15 my-4" />

          <p className="text-[#8e8e93] text-sm leading-relaxed mb-4 text-center">
            ¡Todo listo! Tus selecciones han sido enviadas de verdad.
          </p>

          <div className="h-px bg-[#F5C518]/15 my-4" />

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="suggestion-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <label
                  htmlFor="suggestion-input"
                  className="block text-[#F5C518] text-xs font-semibold uppercase tracking-wider"
                >
                  ¿Alguna sugerencia extra? 💬
                </label>
                <textarea
                  id="suggestion-input"
                  rows={3}
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Escribe aquí cualquier cosa que quieras agregar, cambiar o sugerir..."
                  className="w-full rounded-xl bg-[#1c1c1e] border border-[#2c2c2e] focus:border-[#F5C518]/50 focus:ring-1 focus:ring-[#F5C518]/30 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition resize-none"
                />
                <button
                  type="submit"
                  disabled={!suggestion.trim() || isSubmitting}
                  className="w-full py-2.5 rounded-xl font-bold text-[#111111] text-xs transition duration-200 active:scale-95 disabled:opacity-50 disabled:scale-100"
                  style={{
                    background: "linear-gradient(135deg, #FFD700 0%, #F5C518 100%)",
                    boxShadow: "0 4px 15px rgba(245,197,24,0.2)",
                  }}
                >
                  {isSubmitting ? "Enviando..." : "Enviar sugerencia ✨"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-2"
              >
                <p className="text-[#30d158] text-sm font-semibold mb-1">
                  ✓ ¡Sugerencia enviada!
                </p>
                <p className="text-[#8e8e93] text-xs">
                  Jorge ya la tiene en su radar.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative dots */}
        <motion.div
          className="flex gap-2 justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#F5C518]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
