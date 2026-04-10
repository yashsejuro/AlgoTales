import { motion, AnimatePresence } from 'motion/react';
import { BookOpen } from 'lucide-react';

interface StoryPanelProps {
  story: string;
}

export default function StoryPanel({ story }: StoryPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6 text-[var(--color-neon-yellow)]">
        <BookOpen className="w-5 h-5" />
        <h3 className="font-display font-semibold tracking-wide">The Story</h3>
      </div>
      
      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={story}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-lg leading-relaxed text-gray-200 font-serif italic"
          >
            "{story}"
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
