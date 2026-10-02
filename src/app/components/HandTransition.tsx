"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";

/**
 * Animates a whole hand of cards as one unit. When the hand changes, the old
 * set fades out quickly and the new set slides in one card at a time, so
 * nothing overlaps or jumps. Cards inside must be <HandCard>.
 */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.14, ease: "easeIn" } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 32 },
  },
};

export function HandTransition({
  handKey,
  className,
  children,
}: {
  /** Changes whenever a different hand is dealt. */
  handKey: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={handKey}
        className={className}
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** A single card of a hand, entering with its siblings' stagger. */
export const handCardVariants = card;
