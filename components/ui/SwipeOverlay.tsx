"use client";

import { motion, AnimatePresence } from "framer-motion";

interface SwipeOverlayProps {
  message: "match" | "miss" | null;
}

const OVERLAY_CONFIG = {
  match: {
    text: "it's a match 💛",
    color: "#30d158",
    bgColor: "rgba(48, 209, 88, 0.08)",
    borderColor: "rgba(48, 209, 88, 0.3)",
  },
  miss: {
    text: "you missed a potential match",
    color: "#ff453a",
    bgColor: "rgba(255, 69, 58, 0.08)",
    borderColor: "rgba(255, 69, 58, 0.3)",
  },
};

export default function SwipeOverlay({ message }: SwipeOverlayProps) {
  const config = message ? OVERLAY_CONFIG[message] : null;

  return (
    <AnimatePresence>
      {message && config && (
        <motion.div
          key={message + Date.now()}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="rounded-2xl border px-6 py-4 backdrop-blur-md"
            style={{
              backgroundColor: config.bgColor,
              borderColor: config.borderColor,
            }}
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <p
              className="font-bold text-lg text-center"
              style={{ color: config.color }}
            >
              {config.text}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
