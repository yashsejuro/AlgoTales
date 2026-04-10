import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Code2, Gamepad2, Settings2 } from 'lucide-react';
import type { VisualizerProps } from '../../pages/VisualizationPage';
import ThoughtBubble from '../enhancements/ThoughtBubble';
import StepTimeline from '../enhancements/StepTimeline';
import CodeSyncPanel from '../enhancements/CodeSyncPanel';

const DEFAULT_TREE_NODES = [
  { id: 1, value: '1', x: 50, y: 10, left: 2, right: 3 },
  { id: 2, value: '2', x: 25, y: 40, left: 4, right: 5 },
  { id: 3, value: '3', x: 75, y: 40, left: 6, right: 7 },
  { id: 4, value: '4', x: 12.5, y: 70, left: null, right: null },
  { id: 5, value: '5', x: 37.5, y: 70, left: null, right: null },
  { id: 6, value: '6', x: 62.5, y: 70, left: null, right: null },
  { id: 7, value: '7', x: 87.5, y: 70, left: null, right: null },
];

const TRAVERSALS = {
  inorder: { name: 'Inorder', path: [4, 2, 5, 1, 6, 3, 7], desc: 'Left, Root, Right' },
  preorder: { name: 'Preorder', path: [1, 2, 4, 5, 3, 6, 7], desc: 'Root, Left, Right' },
  postorder: { name: 'Postorder', path: [4, 5, 2, 6, 7, 3, 1], desc: 'Left, Right, Root' }
};

const TREE_CODE = {
  inorder: [
    "function inorder(node) {",
    "  if (!node) return;",
    "  inorder(node.left);",
    "  visit(node);",
    "  inorder(node.right);",
    "}"
  ],
  preorder: [
    "function preorder(node) {",
    "  if (!node) return;",
    "  visit(node);",
    "  preorder(node.left);",
    "  preorder(node.right);",
    "}"
  ],
  postorder: [
    "function postorder(node) {",
    "  if (!node) return;",
    "  postorder(node.left);",
    "  postorder(node.right);",
    "  visit(node);",
    "}"
  ]
};

type TraversalType = keyof typeof TRAVERSALS;

interface TreeState {
  visitedNodes: number[];
  currentNode: number | null;
  message: string;
  povMessage: string;
  codeLine: number;
}

export default function BinaryTreeVisualizer({
  isPlaying,
  speed,
  stepTrigger,
  resetTrigger,
  onStoryUpdate,
  onComplete
}: VisualizerProps) {
  const [treeNodes, setTreeNodes] = useState(DEFAULT_TREE_NODES);
  const [customInput, setCustomInput] = useState('');
  
  const [traversalType, setTraversalType] = useState<TraversalType>('inorder');
  const [history, setHistory] = useState<TreeState[]>([{
    visitedNodes: [], currentNode: null, message: "Select a traversal type.", povMessage: "Ready!", codeLine: 0
  }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Feature Toggles
  const [showPov, setShowPov] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [challengeMessage, setChallengeMessage] = useState("");

  const currentState = history[currentIndex];
  const { visitedNodes, currentNode } = currentState;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const reset = () => {
    setHistory([{
      visitedNodes: [], currentNode: null, message: "Select a traversal type.", povMessage: "Ready!", codeLine: 0
    }]);
    setCurrentIndex(0);
    setChallengeMessage("");
    onStoryUpdate("Select a traversal type and click 'Start' to begin.");
  };

  useEffect(() => {
    if (resetTrigger > 0) reset();
  }, [resetTrigger]);

  useEffect(() => {
    onStoryUpdate(currentState.message);
  }, [currentIndex, currentState.message, onStoryUpdate]);

  const generateHistory = (type: TraversalType) => {
    const path = TRAVERSALS[type].path;
    const newHistory: TreeState[] = [{
      visitedNodes: [],
      currentNode: null,
      message: `Starting ${TRAVERSALS[type].name} Traversal (${TRAVERSALS[type].desc}).`,
      povMessage: "Let's go! 🚀",
      codeLine: 0
    }];

    const visited: number[] = [];
    for (const id of path) {
      visited.push(id);
      const nodeVal = treeNodes.find(n => n.id === id)?.value;
      newHistory.push({
        visitedNodes: [...visited],
        currentNode: id,
        message: `Visiting node ${nodeVal} (${TRAVERSALS[type].name}).`,
        povMessage: `Visiting ${nodeVal}! 🎯`,
        codeLine: type === 'inorder' ? 3 : type === 'preorder' ? 2 : 4
      });
    }

    newHistory.push({
      visitedNodes: [...visited],
      currentNode: null,
      message: `The ${TRAVERSALS[type].name} Traversal is complete!`,
      povMessage: "Done! 🏁",
      codeLine: 5
    });

    return newHistory;
  };

  const handleStart = (type: TraversalType) => {
    setTraversalType(type);
    const newHistory = generateHistory(type);
    setHistory(newHistory);
    setCurrentIndex(0);
    setChallengeMessage("");
  };

  const performStep = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    if (stepTrigger > 0 && history.length > 1 && !isChallengeMode) {
      performStep();
    }
  }, [stepTrigger]);

  useEffect(() => {
    if (isPlaying && history.length > 1 && !isChallengeMode) {
      if (currentIndex < history.length - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 2000 / speed);
      } else {
        onComplete();
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, speed, history.length, isChallengeMode, currentIndex]);

  const handleCustomDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = customInput.split(',').map(v => v.trim()).filter(v => v);
    if (values.length > 0) {
      const newNodes = DEFAULT_TREE_NODES.map((node, i) => ({
        ...node,
        value: values[i] || node.value
      }));
      setTreeNodes(newNodes);
      reset();
    }
  };

  const handleNodeClick = (id: number) => {
    if (!isChallengeMode || history.length <= 1) return;
    
    const path = TRAVERSALS[traversalType].path;
    const expectedNextId = path[visitedNodes.length];

    if (id === expectedNextId) {
      setChallengeMessage("Correct! 🎯");
      setCurrentIndex(prev => Math.min(prev + 1, history.length - 1));
      if (visitedNodes.length + 1 === path.length) {
        setChallengeMessage("Traversal Complete! You win! 🏆");
      }
    } else {
      setChallengeMessage(`Wrong! Remember ${TRAVERSALS[traversalType].name} is ${TRAVERSALS[traversalType].desc}.`);
    }
  };

  const renderEdges = () => {
    const edges = [];
    for (const node of treeNodes) {
      if (node.left) {
        const child = treeNodes.find(n => n.id === node.left);
        if (child) {
          edges.push(
            <line key={`edge-${node.id}-${child.id}`} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${child.x}%`} y2={`${child.y}%`} stroke="var(--color-dark-border)" strokeWidth="2" />
          );
        }
      }
      if (node.right) {
        const child = treeNodes.find(n => n.id === node.right);
        if (child) {
          edges.push(
            <line key={`edge-${node.id}-${child.id}`} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${child.x}%`} y2={`${child.y}%`} stroke="var(--color-dark-border)" strokeWidth="2" />
          );
        }
      }
    }
    return edges;
  };

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-6xl h-full overflow-y-auto pb-20">
      
      {/* Feature Toggles */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
        <button onClick={() => setShowSettings(!showSettings)} className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-white/10 hover:bg-white/20 text-white flex items-center gap-2">
          <Settings2 className="w-4 h-4" /> Custom Data
        </button>
        <button onClick={() => setShowPov(!showPov)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${showPov ? 'bg-[var(--color-neon-purple)] text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
          <Brain className="w-4 h-4" /> POV Mode
        </button>
        <button onClick={() => setShowCode(!showCode)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${showCode ? 'bg-[var(--color-neon-cyan)] text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
          <Code2 className="w-4 h-4" /> Code Sync
        </button>
        <button onClick={() => { setIsChallengeMode(!isChallengeMode); setChallengeMessage(""); }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isChallengeMode ? 'bg-[var(--color-amber)] text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
          <Gamepad2 className="w-4 h-4" /> Challenge Mode
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full max-w-2xl overflow-hidden mb-6">
            <div className="bg-black/40 p-4 rounded-xl border border-[var(--color-dark-border)] flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Set Node Values (up to 7, comma separated)</label>
                <form onSubmit={handleCustomDataSubmit} className="flex gap-2">
                  <input type="text" value={customInput} onChange={e => setCustomInput(e.target.value)} placeholder="e.g. A, B, C, D, E, F, G" className="flex-1 px-3 py-2 bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded text-white focus:outline-none focus:border-[var(--color-neon-purple)] font-mono text-sm" />
                  <button type="submit" className="px-4 py-2 bg-[var(--color-neon-purple)] text-black font-bold rounded hover:scale-105 transition-transform neon-border-purple">Update Tree</button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 text-center w-full max-w-2xl">
        <h3 className="text-xl font-display text-gray-300 mb-2">Interactive Binary Tree</h3>
        <p className="text-sm font-mono text-gray-500 mb-6">Choose a Traversal Method</p>
        
        {isChallengeMode ? (
          <div className="bg-[var(--color-amber)]/20 border border-[var(--color-amber)] p-4 rounded-xl mb-6">
            <h3 className="text-xl font-bold text-[var(--color-amber)] mb-2">Challenge Mode Active!</h3>
            <p className="text-sm text-amber-200/80 mb-2">Click the nodes in the correct {TRAVERSALS[traversalType].name} order.</p>
            {challengeMessage && <p className="text-md font-bold text-white">{challengeMessage}</p>}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 bg-black/40 p-4 rounded-xl border border-[var(--color-dark-border)]">
            {(Object.keys(TRAVERSALS) as TraversalType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleStart(type)}
                className={`px-4 py-2 font-bold rounded transition-colors ${
                  history.length > 1 && traversalType === type
                    ? 'bg-[var(--color-neon-purple)] text-black neon-border-purple'
                    : 'bg-transparent border border-[var(--color-neon-purple)] text-[var(--color-neon-purple)] hover:bg-[var(--color-neon-purple)]/20'
                }`}
              >
                {TRAVERSALS[type].name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col xl:flex-row gap-12 w-full items-start justify-center">
        
        {/* Main Visualization Area */}
        <div className="flex flex-col gap-8 w-full xl:w-1/2 items-center">
          
          <div className="relative w-full aspect-square max-w-[400px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {renderEdges()}
            </svg>

            {treeNodes.map(node => {
              const isVisited = visitedNodes.includes(node.id);
              const isCurrent = currentNode === node.id;
              
              let bgColor = 'bg-[var(--color-dark-surface)]';
              let borderColor = 'border-[var(--color-dark-border)]';
              let textColor = 'text-white';
              let scale = 1;
              let zIndex = 10;

              if (isCurrent) {
                bgColor = 'bg-[var(--color-neon-purple)]';
                borderColor = 'border-[var(--color-neon-purple)] neon-border-purple';
                textColor = 'text-black';
                scale = 1.2;
                zIndex = 20;
              } else if (isVisited) {
                bgColor = 'bg-[var(--color-neon-purple)]/20';
                borderColor = 'border-[var(--color-neon-purple)]';
                textColor = 'text-[var(--color-neon-purple)]';
              }

              return (
                <div
                  key={node.id}
                  className="absolute"
                  style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex }}
                >
                  <motion.div
                    animate={{ scale }}
                    onClick={() => handleNodeClick(node.id)}
                    className={`relative w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center font-bold transition-colors duration-300 shadow-lg ${bgColor} ${borderColor} ${textColor} ${isChallengeMode ? 'cursor-pointer hover:scale-110 hover:border-[var(--color-amber)] hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]' : ''}`}
                  >
                    {node.value}
                    {/* POV Bubble */}
                    {showPov && isCurrent && (
                      <ThoughtBubble text={currentState.povMessage} visible={true} />
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Time Travel Slider */}
          {history.length > 1 && (
            <div className="w-full max-w-md">
              <StepTimeline 
                current={currentIndex} 
                total={history.length - 1} 
                onChange={setCurrentIndex} 
              />
            </div>
          )}
        </div>

        {/* Code Sync Panel */}
        <AnimatePresence>
          {showCode && (
            <motion.div 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 50 }}
              className="w-full xl:w-1/3 flex justify-center xl:justify-start"
            >
              <CodeSyncPanel 
                activeLine={currentState.codeLine} 
                code={TREE_CODE[traversalType]}
                filename={`${traversalType}.js`}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
