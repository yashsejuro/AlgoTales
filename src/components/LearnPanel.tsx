import { motion } from 'motion/react';
import { BookOpen, BrainCircuit, Cpu, Zap, Database, ChevronRight } from 'lucide-react';
import { ConceptType } from '../App';

interface LearnPanelProps {
  concept: ConceptType;
  onStartVisual: () => void;
}

const LEARN_DATA: Record<ConceptType, any> = {
  'binary-search': {
    title: 'Binary Search',
    color: 'var(--color-blue)',
    beginner: {
      title: 'The Wise Owl\'s Dictionary',
      text: 'Imagine looking for the word "Algorithm" in a massive dictionary. You wouldn\'t read page 1, then page 2, then page 3. Instead, you open the book to the middle. If you see "Monkey", you know "Algorithm" must be in the first half. You tear the book in half, throw away the second half, and repeat! This is the magic of Binary Search—eliminating half the possibilities every single step.',
    },
    intermediate: {
      title: 'How It Works (O(log n))',
      text: 'Binary search requires a sorted array. It maintains two pointers: Left and Right. It calculates the Midpoint. If the target is smaller than the Midpoint, Right becomes Mid - 1. If larger, Left becomes Mid + 1. Because the search space halves each time, searching 1,000,000 items takes at most 20 steps (since 2^20 ≈ 1,000,000).',
    },
    advanced: {
      title: 'Cache Locality & Master Theorem',
      text: 'While Binary Search is O(log n), it is exceptionally fast in practice on modern CPUs due to "Cache Locality". Arrays are stored in contiguous memory blocks. When the CPU fetches the midpoint, it pulls surrounding elements into the L1/L2 cache. This makes Binary Search on Arrays vastly superior to Binary Search on Linked Lists (which causes cache misses).',
      useCases: ['Database Indexing (B-Trees)', 'Debugging (Git Bisect)', 'Finding boundaries in sorted data']
    }
  },
  'stack': {
    title: 'Stack',
    color: 'var(--color-amber)',
    beginner: {
      title: 'The Monkey\'s Plate Stack',
      text: 'Think of a stack of plates at a buffet. When a clean plate is added, it goes on the TOP. When someone needs a plate, they take it from the TOP. You can never easily pull a plate from the bottom without making a mess. This is called LIFO (Last In, First Out). The last plate added is the first one removed.',
    },
    intermediate: {
      title: 'Push and Pop (O(1))',
      text: 'Stacks have two main operations: "Push" (add to top) and "Pop" (remove from top). Both operations are incredibly fast—O(1) time complexity—because you don\'t need to shift any other elements around. You just update a single pointer that keeps track of the "Top".',
    },
    advanced: {
      title: 'The Call Stack & Memory Layout',
      text: 'Every time a function calls another function in programming, the computer uses a Stack. The current function\'s state is "Pushed" onto the Call Stack. When the inner function finishes, it is "Popped" off, and the computer resumes the previous function. If you have infinite recursion, the stack grows until it crashes—this is the famous "Stack Overflow" error.',
      useCases: ['Undo/Redo features', 'Browser History (Back button)', 'Syntax parsing (matching parentheses)']
    }
  },
  'linked-list': {
    title: 'Linked List',
    color: 'var(--color-emerald)',
    beginner: {
      title: 'The Elephant\'s Treasure Hunt',
      text: 'Imagine a treasure hunt where you are given a clue. That clue doesn\'t have the treasure, but it tells you exactly where the NEXT clue is hidden. You have to follow them one by one. A Linked List is just like this! Instead of storing data in one big block, data is scattered, and each piece (a "Node") holds a pointer (a map) to the next piece.',
    },
    intermediate: {
      title: 'Nodes and Pointers',
      text: 'Unlike arrays, Linked Lists do not have indexes. To find the 5th item, you must start at the Head (1st item) and follow the pointers 4 times. This makes searching slow (O(n)). However, if you already know where you want to insert or delete a node, it is lightning fast (O(1)) because you just change where the arrows point!',
    },
    advanced: {
      title: 'Memory Fragmentation & Variants',
      text: 'Because nodes are allocated dynamically, they are scattered across the Heap memory. This leads to poor spatial locality and frequent CPU Cache Misses, making iterating through a Linked List much slower than an Array in real-world time, despite both being O(n). Advanced variants include Doubly Linked Lists (pointers going both ways) and Circular Linked Lists.',
      useCases: ['Implementing Queues/Stacks', 'Blockchain (cryptography)', 'Dynamic memory allocation']
    }
  },
  'binary-tree': {
    title: 'Binary Tree',
    color: 'var(--color-violet)',
    beginner: {
      title: 'The Turtle\'s Family Tree',
      text: 'Think of a corporate hierarchy or a family tree. You have a CEO at the very top (the Root). The CEO manages at most two Vice Presidents (Left Child, Right Child). Each VP manages at most two Directors, and so on. In a Binary Tree, every node branches out to a maximum of two children, creating a beautiful hierarchical structure.',
    },
    intermediate: {
      title: 'Traversals and BSTs',
      text: 'How do you read a tree? We use Traversals. "Inorder" reads Left, then Root, then Right. If the tree is a Binary Search Tree (BST)—where left children are smaller and right children are larger—an Inorder Traversal will read the numbers in perfectly sorted order! Searching a balanced BST takes O(log n) time.',
    },
    advanced: {
      title: 'Self-Balancing & Degeneracy',
      text: 'If you insert sorted data into a standard BST (1, 2, 3, 4), it becomes a straight line—a "Degenerate Tree"—ruining the performance to O(n). To fix this, advanced structures like AVL Trees and Red-Black Trees automatically rotate their nodes during insertion to guarantee the tree stays perfectly balanced, ensuring O(log n) operations.',
      useCases: ['3D Video Games (BSP Trees)', 'File Systems', 'DOM (Document Object Model) in HTML']
    }
  }
};

export default function LearnPanel({ concept, onStartVisual }: LearnPanelProps) {
  const data = LEARN_DATA[concept];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full h-full overflow-y-auto pb-24 px-4 md:px-8 lg:px-16 custom-scrollbar">
      <motion.div 
        className="max-w-4xl mx-auto pt-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4" style={{ color: data.color }}>
            {data.title}
          </h1>
          <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">From Scratch to Advanced</p>
        </motion.div>

        {/* Beginner Section */}
        <motion.div variants={itemVariants} className="mb-8 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
              <BookOpen className="w-6 h-6" style={{ color: data.color }} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-200">1. The Basics</h2>
          </div>
          <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: data.color }}></div>
            <h3 className="text-xl font-display mb-3 text-white">{data.beginner.title}</h3>
            <p className="text-gray-300 leading-relaxed text-lg">{data.beginner.text}</p>
          </div>
        </motion.div>

        {/* Intermediate Section */}
        <motion.div variants={itemVariants} className="mb-8 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-200">2. How It Works</h2>
          </div>
          <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
            <h3 className="text-xl font-display mb-3 text-white">{data.intermediate.title}</h3>
            <p className="text-gray-300 leading-relaxed text-lg">{data.intermediate.text}</p>
          </div>
        </motion.div>

        {/* Advanced Section */}
        <motion.div variants={itemVariants} className="mb-12 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
              <Cpu className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-200">3. Under The Hood</h2>
          </div>
          <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
            <h3 className="text-xl font-display mb-3 text-white">{data.advanced.title}</h3>
            <p className="text-gray-300 leading-relaxed text-lg mb-6">{data.advanced.text}</p>
            
            <div className="bg-black/30 rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-gray-400" />
                <h4 className="font-mono text-sm text-gray-400 uppercase tracking-wider">Real-World Use Cases</h4>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {data.advanced.useCases.map((useCase: string, idx: number) => (
                  <li key={idx} className="bg-white/5 px-4 py-3 rounded-lg text-sm text-gray-300 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: data.color }}></div>
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="flex justify-center mt-16 mb-8">
          <button
            onClick={onStartVisual}
            className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <span className="relative flex items-center gap-2">
              <BrainCircuit className="w-6 h-6" />
              Enter Interactive Sandbox
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
