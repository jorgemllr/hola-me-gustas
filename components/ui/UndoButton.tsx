"use client";

import { motion } from "framer-motion";

interface UndoButtonProps {
  onUndo: () => void;
  disabled: boolean;
}

export default function UndoButton({ onUndo, disabled }: UndoButtonProps) {
  return (
    <motion.button
      id="undo-btn"
      onClick={onUndo}
      disabled={disabled}
      aria-label="Deshacer último desliz"
      className={`flex flex-col items-center gap-1 transition-all ${
        disabled ? "opacity-20 cursor-not-allowed" : "opacity-100"
      }`}
      whileTap={disabled ? {} : { scale: 0.85 }}
      whileHover={disabled ? {} : { scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {/* Circle button */}
      <div
        className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
          disabled
            ? "border-[#3a3a3c] bg-transparent"
            : "border-[#F5C518]/40 bg-[#F5C518]/5 hover:bg-[#F5C518]/10"
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 14L4 9L9 4"
            stroke={disabled ? "#3a3a3c" : "#F5C518"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 9H15C17.7614 9 20 11.2386 20 14C20 16.7614 17.7614 19 15 19H12"
            stroke={disabled ? "#3a3a3c" : "#F5C518"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span
        className="text-[10px] font-medium tracking-wider uppercase"
        style={{ color: disabled ? "#3a3a3c" : "#8e8e93" }}
      >
        Deshacer
      </span>
    </motion.button>
  );
}
