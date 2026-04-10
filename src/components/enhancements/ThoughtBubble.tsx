import { motion, AnimatePresence } from 'motion/react';

export default function ThoughtBubble({ text, visible }: { text: string, visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && text && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-2 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(255,255,255,0.5)] whitespace-nowrap z-50 pointer-events-none"
        >
          {text}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
