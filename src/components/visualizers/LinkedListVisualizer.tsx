import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Brain, Code2, Gamepad2, Settings2 } from 'lucide-react';
import type { VisualizerProps } from '../../pages/VisualizationPage';
import ThoughtBubble from '../enhancements/ThoughtBubble';
import StepTimeline from '../enhancements/StepTimeline';
import CodeSyncPanel from '../enhancements/CodeSyncPanel';

const LL_CODE = [
  "class LinkedList {",
  "  constructor() { this.head = null; }",
  "  insertHead(val) {",
  "    this.head = { val, next: this.head };",
  "  }",
  "  insertTail(val) {",
  "    if (!this.head) return this.insertHead(val);",
  "    let curr = this.head;",
  "    while (curr.next) curr = curr.next;",
  "    curr.next = { val, next: null };",
  "  }",
  "  deleteHead() {",
  "    if (this.head) this.head = this.head.next;",
  "  }",
  "  deleteTail() {",
  "    if (!this.head || !this.head.next) return this.deleteHead();",
  "    let curr = this.head;",
  "    while (curr.next.next) curr = curr.next;",
  "    curr.next = null;",
  "  }",
  "}"
];

interface NodeData {
  id: number;
  value: string;
}

interface LLState {
  nodes: NodeData[];
  message: string;
  povMessage: string;
  povNodeIndex: number | null;
  codeLine: number;
}

const INITIAL_STATE: LLState = {
  nodes: [],
  message: "Linked List initialized. Enter a value and choose where to insert it.",
  povMessage: "I'm empty!",
  povNodeIndex: null,
  codeLine: 1
};

export default function LinkedListVisualizer({
  resetTrigger,
  onStoryUpdate,
}: VisualizerProps) {
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<LLState[]>([INITIAL_STATE]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextId = useRef(0);

  // Feature Toggles
  const [showPov, setShowPov] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [challengeMessage, setChallengeMessage] = useState("");

  const currentState = history[currentIndex];
  const { nodes } = currentState;

  const reset = () => {
    setHistory([INITIAL_STATE]);
    setCurrentIndex(0);
    setInputValue('');
    setChallengeMessage("");
    nextId.current = 0;
    onStoryUpdate(INITIAL_STATE.message);
  };

  useEffect(() => {
    if (resetTrigger > 0) reset();
  }, [resetTrigger]);

  useEffect(() => {
    onStoryUpdate(currentState.message);
  }, [currentIndex, currentState.message, onStoryUpdate]);

  const handleInsertTail = (e?: React.FormEvent, overrideValues?: string[]) => {
    if (e) e.preventDefault();
    
    const valuesToInsert = overrideValues || [inputValue];
    if (valuesToInsert.length === 0 || !valuesToInsert[0].trim()) return;

    let currentHist = history.slice(0, currentIndex + 1);
    let currentNodes = [...currentHist[currentHist.length - 1].nodes];

    for (const val of valuesToInsert) {
      if (!val.trim()) continue;
      if (currentNodes.length >= 6) {
        currentHist.push({
          nodes: [...currentNodes],
          message: "List is getting too long! Delete some nodes first.",
          povMessage: "Too long! 🛑",
          povNodeIndex: currentNodes.length - 1,
          codeLine: 6
        });
        break;
      }
      
      const newNode = { id: nextId.current++, value: val };
      currentNodes.push(newNode);
      
      currentHist.push({
        nodes: [...currentNodes],
        message: `Inserted '${val}' at the Tail (end) of the list.`,
        povMessage: `New Tail: ${val} ✨`,
        povNodeIndex: currentNodes.length - 1,
        codeLine: 10
      });
    }

    setHistory(currentHist);
    setCurrentIndex(currentHist.length - 1);
    setInputValue('');
    setChallengeMessage("");
  };

  const handleInsertHead = () => {
    if (!inputValue.trim()) return;

    let currentHist = history.slice(0, currentIndex + 1);
    let currentNodes = [...currentHist[currentHist.length - 1].nodes];

    if (currentNodes.length >= 6) {
      currentHist.push({
        nodes: [...currentNodes],
        message: "List is getting too long! Delete some nodes first.",
        povMessage: "Too long! 🛑",
        povNodeIndex: 0,
        codeLine: 2
      });
    } else {
      const newNode = { id: nextId.current++, value: inputValue };
      currentNodes.unshift(newNode);
      
      currentHist.push({
        nodes: [...currentNodes],
        message: `Inserted '${inputValue}' at the Head (start) of the list.`,
        povMessage: `New Head: ${inputValue} ✨`,
        povNodeIndex: 0,
        codeLine: 3
      });
    }

    setHistory(currentHist);
    setCurrentIndex(currentHist.length - 1);
    setInputValue('');
    setChallengeMessage("");
  };

  const handleDeleteHead = () => {
    let currentHist = history.slice(0, currentIndex + 1);
    let currentNodes = [...currentHist[currentHist.length - 1].nodes];

    if (currentNodes.length === 0) {
      currentHist.push({
        nodes: [...currentNodes],
        message: "The list is already empty.",
        povMessage: "Nothing to delete! 😭",
        povNodeIndex: null,
        codeLine: 12
      });
    } else {
      const removed = currentNodes.shift();
      currentHist.push({
        nodes: [...currentNodes],
        message: `Deleted '${removed?.value}' from the Head.`,
        povMessage: `Deleted Head! 🗑️`,
        povNodeIndex: currentNodes.length > 0 ? 0 : null,
        codeLine: 13
      });
    }

    setHistory(currentHist);
    setCurrentIndex(currentHist.length - 1);
    setChallengeMessage("");
  };

  const handleDeleteTail = () => {
    let currentHist = history.slice(0, currentIndex + 1);
    let currentNodes = [...currentHist[currentHist.length - 1].nodes];

    if (currentNodes.length === 0) {
      currentHist.push({
        nodes: [...currentNodes],
        message: "The list is already empty.",
        povMessage: "Nothing to delete! 😭",
        povNodeIndex: null,
        codeLine: 15
      });
    } else {
      const removed = currentNodes.pop();
      currentHist.push({
        nodes: [...currentNodes],
        message: `Deleted '${removed?.value}' from the Tail.`,
        povMessage: `Deleted Tail! 🗑️`,
        povNodeIndex: currentNodes.length > 0 ? currentNodes.length - 1 : null,
        codeLine: 19
      });
    }

    setHistory(currentHist);
    setCurrentIndex(currentHist.length - 1);
    setChallengeMessage("");
  };

  const handleCustomDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = inputValue.split(',').map(v => v.trim()).filter(v => v);
    if (values.length > 0) {
      reset();
      setTimeout(() => {
        handleInsertTail(undefined, values);
      }, 100);
    }
  };

  const handleNodeClick = (idx: number) => {
    if (!isChallengeMode) return;
    if (idx === nodes.length - 1) {
      setChallengeMessage("Correct! That's the Tail. 🎯");
      handleDeleteTail();
    } else {
      setChallengeMessage("Wrong! You must click the Tail node to delete it.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-6xl h-full overflow-y-auto pb-20">
      
      {/* Feature Toggles */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
        <button onClick={() => setShowSettings(!showSettings)} className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-white/10 hover:bg-white/20 text-white flex items-center gap-2">
          <Settings2 className="w-4 h-4" /> Custom Data
        </button>
        <button onClick={() => setShowPov(!showPov)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${showPov ? 'bg-[var(--color-neon-green)] text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
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
                <label className="text-xs text-gray-400 mb-1 block">Initialize List (comma separated)</label>
                <form onSubmit={handleCustomDataSubmit} className="flex gap-2">
                  <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="e.g. A, B, C" className="flex-1 px-3 py-2 bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded text-white focus:outline-none focus:border-[var(--color-neon-green)] font-mono text-sm" />
                  <button type="submit" className="px-4 py-2 bg-[var(--color-neon-green)] text-black font-bold rounded hover:scale-105 transition-transform neon-border-green">Create List</button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 text-center w-full max-w-2xl">
        <h3 className="text-xl font-display text-gray-300 mb-2">Interactive Singly Linked List</h3>
        <p className="text-sm font-mono text-gray-500 mb-6">Nodes connected by pointers</p>
        
        {isChallengeMode ? (
          <div className="bg-[var(--color-amber)]/20 border border-[var(--color-amber)] p-4 rounded-xl mb-6">
            <h3 className="text-xl font-bold text-[var(--color-amber)] mb-2">Challenge Mode Active!</h3>
            <p className="text-sm text-amber-200/80 mb-2">Predict the Delete! Click the node that will be removed when Delete Tail is called.</p>
            {challengeMessage && <p className="text-md font-bold text-white">{challengeMessage}</p>}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 bg-black/40 p-4 rounded-xl border border-[var(--color-dark-border)]">
            <form onSubmit={handleInsertTail} className="flex gap-2">
              <input
                type="text"
                maxLength={3}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Value"
                className="w-24 px-3 py-2 bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded text-white focus:outline-none focus:border-[var(--color-neon-green)] text-center"
              />
              <button
                type="button"
                onClick={handleInsertHead}
                className="px-3 py-2 bg-transparent border border-[var(--color-neon-green)] text-[var(--color-neon-green)] font-bold rounded hover:bg-[var(--color-neon-green)] hover:text-black transition-colors text-sm"
              >
                + Head
              </button>
              <button
                type="submit"
                className="px-3 py-2 bg-[var(--color-neon-green)] text-black font-bold rounded hover:scale-105 transition-transform neon-border-green text-sm"
              >
                + Tail
              </button>
            </form>
            <div className="h-8 w-px bg-gray-700 hidden md:block mx-2"></div>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteHead}
                className="px-3 py-2 bg-transparent border border-red-500 text-red-500 font-bold rounded hover:bg-red-500 hover:text-white transition-colors text-sm"
              >
                - Head
              </button>
              <button
                onClick={handleDeleteTail}
                className="px-3 py-2 bg-transparent border border-red-500 text-red-500 font-bold rounded hover:bg-red-500 hover:text-white transition-colors text-sm"
              >
                - Tail
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col xl:flex-row gap-12 w-full items-start justify-center">
        
        {/* Main Visualization Area */}
        <div className="flex flex-col gap-8 w-full xl:w-2/3 items-center overflow-x-auto pb-8">
          
          <div className="flex items-center min-w-max h-40 px-8">
            <AnimatePresence mode="popLayout">
              {nodes.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="text-gray-600 font-mono relative"
                >
                  Head -&gt; null
                  {showPov && <ThoughtBubble text={currentState.povMessage} visible={true} />}
                </motion.div>
              )}
              {nodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.5, x: -50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 50 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex items-center"
                >
                  {/* Node */}
                  <div 
                    className="relative flex flex-col items-center"
                    onClick={() => handleNodeClick(idx)}
                  >
                    {idx === 0 && (
                      <div className="absolute -top-8 text-xs font-mono text-[var(--color-neon-green)]">Head</div>
                    )}
                    <div className={`flex border-2 rounded-lg overflow-hidden bg-[var(--color-dark-surface)] transition-colors ${isChallengeMode ? 'cursor-pointer hover:border-[var(--color-amber)] hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]' : ''} ${idx === currentState.povNodeIndex ? 'border-[var(--color-neon-green)] shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'border-[var(--color-neon-green)]/50'}`}>
                      <div className="w-12 h-12 flex items-center justify-center border-r border-[var(--color-neon-green)]/30">
                        <span className="text-xl font-bold text-white">{node.value}</span>
                      </div>
                      <div className="w-8 h-12 flex items-center justify-center bg-[var(--color-neon-green)]/10">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-neon-green)]"></div>
                      </div>
                    </div>
                    
                    {/* POV Bubble */}
                    {showPov && idx === currentState.povNodeIndex && (
                      <ThoughtBubble text={currentState.povMessage} visible={true} />
                    )}
                  </div>

                  {/* Pointer Arrow */}
                  <div className="mx-2 text-[var(--color-neon-green)]/60">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </motion.div>
              ))}
              
              {nodes.length > 0 && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-600 rounded-lg text-gray-500 font-mono text-sm"
                >
                  null
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Time Travel Slider */}
          {history.length > 1 && (
            <div className="w-full max-w-xl mt-4">
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
                code={LL_CODE}
                filename="linkedList.js"
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
