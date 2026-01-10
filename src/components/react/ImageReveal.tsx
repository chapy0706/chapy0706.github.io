import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface ImageRevealProps {
  children: ReactNode;
  delay?: number;
}

export default function ImageReveal({ children, delay = 0 }: ImageRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
      className="overflow-hidden rounded-2xl"
    >
      {children}
    </motion.div>
  );
}

