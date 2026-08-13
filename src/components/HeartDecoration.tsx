import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

/** A subtle, local hero accent that replaces the former scrolling 3D bouquet. */
export function HeartDecoration() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute right-[8%] top-32 hidden text-[#A4193D]/20 sm:block"
      animate={{ y: [0, -7, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1, 1.06, 1] }}
        transition={{ duration: 2.8, ease: 'easeInOut', repeat: Infinity }}
      >
        <Heart className="h-20 w-20 fill-current" strokeWidth={1} />
      </motion.div>
    </motion.div>
  );
}
