import { motion } from 'motion/react';
import { ArrowLeft, Search, Layers, GitCommit, Network } from 'lucide-react';
import type { ConceptType } from '../App';

interface MenuPageProps {
  onSelectConcept: (concept: ConceptType) => void;
  onBack: () => void;
}

const concepts = [
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'Find elements in a sorted array by repeatedly dividing the search interval in half.',
    icon: Search,
    color: 'var(--color-neon-cyan)',
    shadowClass: 'hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]',
    borderClass: 'hover:border-[var(--color-neon-cyan)]',
  },
  {
    id: 'stack',
    title: 'Stack',
    description: 'A Last-In-First-Out (LIFO) data structure where elements are added and removed from the top.',
    icon: Layers,
    color: 'var(--color-neon-pink)',
    shadowClass: 'hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]',
    borderClass: 'hover:border-[var(--color-neon-pink)]',
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    description: 'A linear collection of data elements whose order is not given by their physical placement in memory.',
    icon: GitCommit,
    color: 'var(--color-neon-green)',
    shadowClass: 'hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]',
    borderClass: 'hover:border-[var(--color-neon-green)]',
  },
  {
    id: 'binary-tree',
    title: 'Binary Tree',
    description: 'A tree data structure in which each node has at most two children, referred to as the left and right child.',
    icon: Network,
    color: 'var(--color-neon-purple)',
    shadowClass: 'hover:shadow-[0_0_20px_rgba(176,38,255,0.3)]',
    borderClass: 'hover:border-[var(--color-neon-purple)]',
  }
] as const;

export default function MenuPage({ onSelectConcept, onBack }: MenuPageProps) {
  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Home
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Choose a Concept</h2>
        <p className="text-gray-400 text-lg">Select a data structure or algorithm to begin your interactive journey.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, index) => {
          const Icon = concept.icon;
          return (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => onSelectConcept(concept.id)}
              className={`glass-panel p-8 rounded-2xl cursor-pointer transition-all duration-300 border border-[var(--color-dark-border)] ${concept.borderClass} ${concept.shadowClass} group`}
            >
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${concept.color}20`, color: concept.color }}
              >
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-display">{concept.title}</h3>
              <p className="text-gray-400 leading-relaxed">{concept.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
