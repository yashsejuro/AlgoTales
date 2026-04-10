import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { VisualizerProps } from '../../pages/VisualizationPage';
import ThoughtBubble from '../enhancements/ThoughtBubble';
import StepTimeline from '../enhancements/StepTimeline';
import CodeSyncPanel from '../enhancements/CodeSyncPanel';
import { Brain, Code2, Gamepad2, Settings2 } from 'lucide-react';

const STACK_CODE = [
  "class Stack {",
  "  constructor() {",
  "    this.items = [];",
  "  }",
  "  push(element) {",
  "    this.items.push(element);",
  "  }",
  "  pop() {",
  "    if (this.items.length === 0) return 'Underflow';",
  "    return this.items.pop();",
  "  }",
  "}"
];

interface StackState {
  stack: number[];
  poppedValue: number | null;
  message: string;
  povMessage: string;
  codeLine: number;
}

const INITIAL_STATE: StackState = {
  stack: [],
  poppedValue: null,
  message: "Stack initialized. Enter a number and click Push.",
  povMessage: "I'm empty!",
  codeLine: 2
};

export default function StackVisualizer({
  resetTrigger,
  onStoryUpdate,
}: VisualizerProps) {
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<StackState[]>([INITIAL_STATE]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Feature Toggles
  const [showPov, setShowPov] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [challengeMessage, setChallengeMessage] = useState("");

  const currentState = history[currentIndex];
  const { stack, poppedValue } = currentState;

  const reset = () => {
    setHistory([INITIAL_STATE]);
    setCurrentIndex(0);
    setInputValue('');
    setChallengeMessage("");
    onStoryUpdate(INITIAL_STATE.message);
  };

  useEffect(() => {
    if (resetTrigger > 0) reset();
  }, [resetTrigger]);

  useEffect(() => {
    onStoryUpdate(currentState.message);
  }, [currentIndex, currentState.message, onStoryUpdate]);

  const handlePush = (e?: React.FormEvent, overrideValue?: string) => {
    if (e) e.preventDefault();
    const valStr = overrideValue !== undefined ? overrideValue : inputValue;
    if (!valStr.trim()) return;

    const values = valStr.split(',').map(v => parseInt(v.trim(), 10)).filter(n => !isNaN(n));
    if (values.length === 0) return;

    let currentHist = history.slice(0, currentIndex + 1);
    let currentStk = [...currentHist[currentHist.length - 1].stack];

    for (const val of values) {
      if (currentStk.length >= 8) {
        currentHist.push({
          stack: [...currentStk],
          poppedValue: null,
          message: "Stack Overflow! The stack is full (max 8 items).",
          povMessage: "I'm full! 🤢",
          codeLine: 4
        });
        break;
      }
      currentStk.push(val);
      currentHist.push({
        stack: [...currentStk],
        poppedValue: null,
        message: `Pushed ${val} onto the top of the stack.`,
        povMessage: `Pushing ${val}...`,
        codeLine: 5
      });
    }

    setHistory(currentHist);
    setCurrentIndex(currentHist.length - 1);
    setInputValue('');
    setChallengeMessage("");
  };

  const handlePop = () => {
    let currentHist = history.slice(0, currentIndex + 1);
    let currentStk = [...currentHist[currentHist.length - 1].stack];

    if (currentStk.length === 0) {
      currentHist.push({
        stack: [...currentStk],
        poppedValue: null,
        message: "Stack Underflow! The stack is already empty.",
        povMessage: "Nothing to pop! 😭",
        codeLine: 8
      });
    } else {
      const popped = currentStk.pop()!;
      currentHist.push({
        stack: [...currentStk],
        poppedValue: popped,
        message: `Popped ${popped} from the top of the stack.`,
        povMessage: `Popping ${popped}! 🚀`,
        codeLine: 9
      });
    }

    setHistory(currentHist);
    setCurrentIndex(currentHist.length - 1);
    setChallengeMessage("");
  };

  const handleNodeClick = (idx: number) => {
    if (!isChallengeMode) return;
    if (idx === stack.length - 1) {
      setChallengeMessage("Correct! LIFO principle. 🎯");
      handlePop();
    } else {
      setChallengeMessage("Wrong! Stack is Last-In-First-Out (LIFO). You must pop the top element.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-6xl h-full overflow-y-auto pb-20">
      
      {/* Feature Toggles */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
        <button onClick={() => setShowSettings(!showSettings)} className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-white/10 hover:bg-white/20 text-white flex items-center gap-2">
          <Settings2 className="w-4 h-4" /> Custom Data
        </button>
        <button onClick={() => setShowPov(!showPov)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${showPov ? 'bg-[var(--color-neon-pink)] text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
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
                <label className="text-xs text-gray-400 mb-1 block">Push Multiple (comma separated)</label>
                <div className="flex gap-2">
                  <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="e.g. 10, 20, 30" className="flex-1 px-3 py-2 bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded text-white focus:outline-none focus:border-[var(--color-neon-pink)] font-mono text-sm" />
                  <button onClick={(e) => handlePush(e)} className="px-4 py-2 bg-[var(--color-neon-pink)] text-black font-bold rounded hover:scale-105 transition-transform neon-border-pink">Push All</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 text-center w-full max-w-2xl">
        <h3 className="text-xl font-display text-gray-300 mb-2">Interactive Stack (LIFO)</h3>
        <p className="text-sm font-mono text-gray-500 mb-6">Last In, First Out</p>
        
        {isChallengeMode ? (
          <div className="bg-[var(--color-amber)]/20 border border-[var(--color-amber)] p-4 rounded-xl mb-6">
            <h3 className="text-xl font-bold text-[var(--color-amber)] mb-2">Challenge Mode Active!</h3>
            <p className="text-sm text-amber-200/80 mb-2">Predict the Pop! Click the element in the stack that will be popped next.</p>
            {challengeMessage && <p className="text-md font-bold text-white">{challengeMessage}</p>}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3 bg-black/40 p-4 rounded-xl border border-[var(--color-dark-border)]">
            <form onSubmit={handlePush} className="flex gap-2">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter number"
                className="w-32 px-3 py-2 bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded text-white focus:outline-none focus:border-[var(--color-neon-pink)]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--color-neon-pink)] text-black font-bold rounded hover:scale-105 transition-transform neon-border-pink"
              >
                Push
              </button>
            </form>
            <button
              onClick={handlePop}
              className="px-4 py-2 bg-transparent border border-[var(--color-neon-pink)] text-[var(--color-neon-pink)] font-bold rounded hover:bg-[var(--color-neon-pink)] hover:text-black transition-colors"
            >
              Pop
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col xl:flex-row gap-12 w-full items-start justify-center">
        
        {/* Main Visualization Area */}
        <div className="flex flex-col gap-8 w-full xl:w-1/2 items-center">
          
          <div className="flex gap-16 items-end h-80">
            {/* The Stack Container */}
            <div className="relative w-48 h-80 border-x-4 border-b-4 border-[var(--color-dark-border)] rounded-b-xl flex flex-col-reverse items-center p-2 bg-black/20">
              <AnimatePresence mode="popLayout">
                {stack.map((val, idx) => {
                  const isTop = idx === stack.length - 1;
                  return (
                    <motion.div
                      key={`${idx}-${val}`}
                      layout
                      initial={{ opacity: 0, y: -100, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      onClick={() => handleNodeClick(idx)}
                      className={`relative w-full h-12 mb-2 bg-[var(--color-dark-surface)] border rounded flex items-center justify-center shadow-[0_0_10px_rgba(255,0,255,0.2)] transition-colors ${isChallengeMode ? 'cursor-pointer hover:border-[var(--color-amber)] hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]' : ''} ${isTop ? 'border-[var(--color-neon-pink)] neon-border-pink' : 'border-[var(--color-dark-border)]'}`}
                    >
                      <span className={`text-xl font-mono font-bold ${isTop ? 'text-[var(--color-neon-pink)]' : 'text-gray-400'}`}>{val}</span>
                      
                      {/* POV Bubble */}
                      {showPov && isTop && (
                        <ThoughtBubble text={currentState.povMessage} visible={true} />
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {stack.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-sm">
                  Empty Stack
                  {showPov && <ThoughtBubble text={currentState.povMessage} visible={true} />}
                </div>
              )}
            </div>

            {/* Popped Element Display */}
            <div className="w-32 h-32 flex flex-col items-center justify-end">
              <AnimatePresence mode="popLayout">
                {poppedValue !== null && (
                  <motion.div
                    key={`popped-${poppedValue}-${history.length}`}
                    initial={{ opacity: 0, y: 50, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="w-24 h-12 bg-[var(--color-dark-surface)] border border-[var(--color-neon-cyan)] rounded flex items-center justify-center shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                  >
                    <span className="text-xl font-mono font-bold text-[var(--color-neon-cyan)]">{poppedValue}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-4 text-xs font-mono text-gray-500 uppercase tracking-widest text-center">Last Popped<br/>Item</div>
            </div>
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
                code={STACK_CODE}
                filename="stack.js"
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
