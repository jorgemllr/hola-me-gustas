"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import type { CardData } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  food: "🍽 Comida",
  drinks: "🥤 Bebida",
  interactive: "✨ Elige",
  vibe: "🎨 Vibe",
  affection: "💛 Afecto",
};

interface SwipeCardProps {
  card: CardData;
  isTop: boolean;
  zIndex: number;
  stackOffset: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SWIPE_THRESHOLD = 100;

export default function SwipeCard({
  card,
  isTop,
  zIndex,
  stackOffset,
  onSwipeLeft,
  onSwipeRight,
}: SwipeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotation based on drag X
  const rotate = useTransform(x, [-300, 0, 300], [-28, 0, 28]);

  // LIKE label opacity (right swipe)
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  // NOPE label opacity (left swipe)
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  // Card opacity fades at extremes
  const cardOpacity = useTransform(x, [-300, -200, 0, 200, 300], [0, 1, 1, 1, 0]);

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > SWIPE_THRESHOLD || velocity > 500) {
      onSwipeRight();
    } else if (offset < -SWIPE_THRESHOLD || velocity < -500) {
      onSwipeLeft();
    }
  }

  const backgroundScale = 1 - stackOffset * 0.05;
  const backgroundY = stackOffset * 12;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex }}
      initial={false}
    >
      <motion.div
        drag={isTop ? "x" : false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{
          x: isTop ? x : 0,
          y: isTop ? y : backgroundY,
          rotate: isTop ? rotate : 0,
          opacity: isTop ? cardOpacity : 1,
          scale: isTop ? 1 : backgroundScale,
          zIndex,
        }}
        className={`relative w-[min(88vw,360px)] h-[min(64vh,530px)] rounded-[24px] overflow-hidden shadow-2xl ${
          isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
        }`}
        whileTap={isTop ? { scale: 0.98 } : {}}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {/* Card background image */}
        <div className="absolute inset-0">
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover"
            draggable={false}
            priority={isTop}
            unoptimized
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />
        </div>

        {/* LIKE overlay */}
        {isTop && (
          <motion.div
            className="absolute top-8 left-6 border-[3px] border-[#30d158] rounded-lg px-3 py-1 rotate-[-15deg]"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-[#30d158] font-black text-2xl tracking-widest uppercase">
              MATCH
            </span>
          </motion.div>
        )}

        {/* NOPE overlay */}
        {isTop && (
          <motion.div
            className="absolute top-8 right-6 border-[3px] border-[#ff453a] rounded-lg px-3 py-1 rotate-[15deg]"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-[#ff453a] font-black text-2xl tracking-widest uppercase">
              NOPE
            </span>
          </motion.div>
        )}

        {/* Card content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
          {/* Category badge */}
          <span
            className={`badge-${card.category} inline-flex items-center text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full mb-3`}
          >
            {CATEGORY_LABELS[card.category] ?? card.category}
          </span>

          {/* Title */}
          <h2 className="text-white font-bold text-xl leading-tight mb-1 drop-shadow-lg">
            {card.title}
          </h2>

          {/* Description */}
          <p className="text-white/70 text-sm leading-relaxed">
            {card.description}
          </p>

          {/* Interactive hint */}
          {card.isInteractive && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-px flex-1 bg-[#F5C518]/30" />
              <span className="text-[#F5C518] text-[10px] font-semibold tracking-widest uppercase">
                elige al deslizar →
              </span>
              <div className="h-px flex-1 bg-[#F5C518]/30" />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
