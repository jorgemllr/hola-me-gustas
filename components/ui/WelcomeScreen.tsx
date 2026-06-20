"use client";

import { motion, type Easing } from "framer-motion";

interface WelcomeScreenProps {
  onStart: () => void;
}

const LETTER_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.4 + i * 0.06, duration: 0.4, ease: "easeOut" as Easing },
  }),
};

function AnimatedText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={LETTER_VARIANTS}
          initial="hidden"
          animate="visible"
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(245,197,24,0.07) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(245,197,24,0.05) 0%, transparent 60%), #0a0a0a",
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#F5C518]/30"
          style={{
            left: `${15 + i * 18}%`,
            top: `${20 + (i % 3) * 22}%`,
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 2.5 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="text-center max-w-xs relative">
        {/* Greeting */}
        <motion.p
          className="text-[#8e8e93] text-sm font-medium tracking-[0.25em] uppercase mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          para ti ✨
        </motion.p>

        {/* Main title — character-by-character animation */}
        <h1
          className="text-5xl font-black leading-tight mb-2"
          style={{
            background: "linear-gradient(135deg, #FFD700 0%, #F5C518 40%, #d4a017 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 30px rgba(245,197,24,0.4))",
          }}
        >
          <AnimatedText text="hola, Mar" />
        </h1>

        {/* Tagline */}
        <motion.p
          className="text-white/90 text-xl font-semibold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          me gustas 💛
        </motion.p>

        {/* Subtitle */}
        <motion.p
          className="text-[#8e8e93] text-sm leading-relaxed mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          Desliza y dime qué te gusta
        </motion.p>

        {/* CTA button */}
        <motion.button
          id="welcome-start-btn"
          onClick={onStart}
          className="relative px-10 py-4 rounded-2xl font-bold text-[#111111] text-base overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #FFD700 0%, #F5C518 100%)",
            boxShadow: "0 8px 30px rgba(245,197,24,0.4), 0 0 0 1px rgba(245,197,24,0.2)",
          }}
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.9, type: "spring", stiffness: 280, damping: 22 }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(245,197,24,0.55)" }}
        >
          {/* Shine sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ delay: 2.5, duration: 0.7, ease: "easeInOut" }}
          />
          Empezar 💫
        </motion.button>

        {/* Tiny hint */}
        <motion.p
          className="text-[#555] text-xs mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.5 }}
        >
          17 opciones para planear juntos
        </motion.p>
      </div>
    </motion.div>
  );
}
