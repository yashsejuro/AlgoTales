import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { VisualizerProps } from '../../pages/VisualizationPage';
import ThoughtBubble from '../enhancements/ThoughtBubble';
import StepTimeline from '../enhancements/StepTimeline';
import CodeSyncPanel from '../enhancements/CodeSyncPanel';
import { Brain, Code2, Gamepad2, Settings2 } from 'lucide-react';

const DEFAULT_ARRAY = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

interface BinaryStep {
  left: number;
  right: number;
  mid: number | null;
  found: boolean;
  message: string;
  povMessage: string;
  codeLine: number;
  isDone: boolean;
}

interface LinearStep {
  index: number;
  found: boolean;
  isDone: boolean;
}

export default function BinarySearchVisualizer({
  isPlaying,
  speed,
  stepTrigger,
  resetTrigger,
  onStoryUpdate,
  onComplete
}: VisualizerProps) {
  // Data State
  const [arrayInput, setArrayInput] = useState(DEFAULT_ARRAY.join(', '));
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [targetInput, setTargetInput] = useState('23');
  const [target, setTarget] = useState(23);
  
  // Feature Toggles
  const [showPov, setShowPov] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [isRacing, setIsRacing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Execution State
  const [isSearching, setIsSearching] = useState(false);
  const [binarySteps, setBinarySteps] = useState<BinaryStep[]>([]);
  const [linearSteps, setLinearSteps] = useState<LinearStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Challenge State
  const [userStepCount, setUserStepCount] = useState(0);
  const [challengeMessage, setChallengeMessage] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const reset = () => {
    setIsSearching(false);
    setCurrentIndex(0);
    setBinarySteps([]);
    setLinearSteps([]);
    setUserStepCount(0);
    setChallengeMessage("");
    onStoryUpdate("Enter a target number and click 'Start Search' to begin.");
  };

  useEffect(() => {
    if (resetTrigger > 0) reset();
  }, [resetTrigger]);

  const generateSteps = (arr: number[], tgt: number) => {
    const bSteps: BinaryStep[] = [];
    let l = 0;
    let r = arr.length - 1;
    
    bSteps.push({ left: l, right: r, mid: null, found: false, message: `Starting search for ${tgt}.`, povMessage: "Where is it?", codeLine: 4, isDone: false });

    while (l <= r) {
      let m = Math.floor((l + r) / 2);
      bSteps.push({ left: l, right: r, mid: m, found: false, message: `Checking middle index ${m} (value: ${arr[m]}).`, povMessage: `Is ${arr[m]} == ${tgt}?`, codeLine: 5, isDone: false });

      if (arr[m] === tgt) {
        bSteps.push({ left: l, right: r, mid: m, found: true, message: `Found ${tgt} at index ${m}!`, povMessage: "Found it! 🎯", codeLine: 7, isDone: true });
        break;
      } else if (arr[m] < tgt) {
        bSteps.push({ left: l, right: r, mid: m, found: false, message: `${arr[m]} < ${tgt}. Discarding left half.`, povMessage: "Too small! 👉", codeLine: 8, isDone: false });
        l = m + 1;
      } else {
        bSteps.push({ left: l, right: r, mid: m, found: false, message: `${arr[m]} > ${tgt}. Discarding right half.`, povMessage: "Too big! 👈", codeLine: 9, isDone: false });
        r = m - 1;
      }
    }
    
    if (l > r) {
      bSteps.push({ left: l, right: r, mid: null, found: false, message: `Target ${tgt} not found.`, povMessage: "Not here! 🤷‍♂️", codeLine: 11, isDone: true });
    }

    const lSteps: LinearStep[] = [];
    for (let i = 0; i < arr.length; i++) {
      lSteps.push({ index: i, found: arr[i] === tgt, isDone: arr[i] === tgt });
      if (arr[i] === tgt) break;
    }
    if (!lSteps.length || !lSteps[lSteps.length-1].found) {
      lSteps.push({ index: arr.length, found: false, isDone: true });
    }

    return { bSteps, lSteps };
  };

  const handleStartSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const parsedArray = arrayInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)).sort((a,b) => a-b);
    if (parsedArray.length === 0) return;
    setArray(parsedArray);
    
    const val = parseInt(targetInput, 10);
    if (isNaN(val)) return;
    setTarget(val);

    const { bSteps, lSteps } = generateSteps(parsedArray, val);
    setBinarySteps(bSteps);
    setLinearSteps(lSteps);
    
    setCurrentIndex(0);
    setIsSearching(true);
    setUserStepCount(0);
    setChallengeMessage(isChallengeMode ? "Click the correct middle element!" : "");
    
    onStoryUpdate(isChallengeMode ? "Challenge Mode: You are the algorithm! Click the correct middle element." : `Starting search for ${val}.`);
  };

  // Playback logic
  useEffect(() => {
    if (stepTrigger > 0 && isSearching && !isChallengeMode) {
      if (currentIndex < binarySteps.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    }
  }, [stepTrigger]);

  useEffect(() => {
    if (isPlaying && isSearching && !isChallengeMode) {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev < binarySteps.length - 1) return prev + 1;
          clearInterval(timerRef.current!);
          onComplete();
          return prev;
        });
      }, 2000 / speed);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, isSearching, isChallengeMode, binarySteps.length]);

  // Story sync
  useEffect(() => {
    if (isSearching && binarySteps[currentIndex] && !isChallengeMode) {
      onStoryUpdate(binarySteps[currentIndex].message);
    }
  }, [currentIndex, isSearching, binarySteps, isChallengeMode]);

  // Challenge Mode Interaction
  const handleNodeClick = (idx: number) => {
    if (!isChallengeMode || !isSearching) return;
    
    const currentStep = binarySteps[currentIndex];
    if (currentStep.isDone) return;

    let expectedMidStepIndex = currentIndex;
    while (expectedMidStepIndex < binarySteps.length && binarySteps[expectedMidStepIndex].mid === null) {
      expectedMidStepIndex++;
    }
    
    if (expectedMidStepIndex >= binarySteps.length) return;
    
    const expectedMid = binarySteps[expectedMidStepIndex].mid;
    
    setUserStepCount(prev => prev + 1);

    if (idx === expectedMid) {
      setChallengeMessage("Correct! 🎯");
      setCurrentIndex(Math.min(expectedMidStepIndex + 1, binarySteps.length - 1));
      if (binarySteps[expectedMidStepIndex].found) {
         setChallengeMessage(`You found it in ${userStepCount + 1} steps! Optimal was ${Math.ceil(binarySteps.length / 2)} steps.`);
      }
    } else {
      setChallengeMessage(`Oops! Expected index ${expectedMid}. Try again.`);
    }
  };

  const currentBStep = binarySteps[currentIndex] || { left: 0, right: array.length - 1, mid: null, found: false, codeLine: 0, povMessage: "" };
  const currentLStep = linearSteps[Math.min(currentIndex, linearSteps.length - 1)] || { index: -1, found: false, isDone: false };

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
        <button onClick={() => { setIsChallengeMode(!isChallengeMode); reset(); }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isChallengeMode ? 'bg-[var(--color-amber)] text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
          <Gamepad2 className="w-4 h-4" /> Challenge Mode
        </button>
        <button onClick={() => { setIsRacing(!isRacing); reset(); }} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isRacing ? 'bg-[var(--color-emerald)] text-black' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
          Race Mode
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full max-w-2xl overflow-hidden mb-6">
            <div className="bg-black/40 p-4 rounded-xl border border-[var(--color-dark-border)] flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Custom Array (comma separated)</label>
                <input type="text" value={arrayInput} onChange={e => setArrayInput(e.target.value)} className="w-full px-3 py-2 bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded text-white focus:outline-none focus:border-[var(--color-blue)] font-mono text-sm" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 text-center w-full max-w-2xl">
        {isChallengeMode ? (
          <div className="bg-[var(--color-amber)]/20 border border-[var(--color-amber)] p-4 rounded-xl">
            <h3 className="text-xl font-bold text-[var(--color-amber)] mb-2">Challenge Mode Active!</h3>
            <p className="text-sm text-amber-200/80 mb-4">{challengeMessage}</p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Target:</span>
                <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="w-20 px-2 py-1 bg-black/50 border border-amber-500/50 rounded text-amber-400 text-center font-bold" />
              </div>
              <button onClick={handleStartSearch} className="px-4 py-1.5 bg-[var(--color-amber)] text-black font-bold rounded hover:scale-105 transition-transform">Start Challenge</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-black/40 p-4 rounded-xl border border-[var(--color-dark-border)]">
            <form onSubmit={handleStartSearch} className="flex gap-2">
              <div className="flex items-center gap-2 mr-2">
                <span className="text-gray-400">Target:</span>
                <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="w-24 px-3 py-2 bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded text-white focus:outline-none focus:border-[var(--color-blue)] text-center font-bold" />
              </div>
              <button type="submit" className="px-4 py-2 bg-[var(--color-blue)] text-white font-bold rounded hover:scale-105 transition-transform neon-border-cyan">Start Search</button>
            </form>
          </div>
        )}
      </div>

      <div className="flex flex-col xl:flex-row gap-8 w-full items-start justify-center">
        
        {/* Main Visualization Area */}
        <div className="flex flex-col gap-12 w-full xl:w-2/3 items-center">
          {/* Binary Search Array */}
          <div className="flex flex-col items-center w-full">
            {isRacing && <h4 className="text-[var(--color-blue)] font-bold mb-4 font-mono uppercase tracking-widest text-sm">Binary Search O(log n)</h4>}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {array.map((num, idx) => {
                const isOutOfRange = isSearching && (idx < currentBStep.left || idx > currentBStep.right);
                const isMid = isSearching && idx === currentBStep.mid;
                const isFound = isSearching && currentBStep.found && idx === currentBStep.mid;

                let bgColor = 'bg-[var(--color-dark-surface)]';
                let borderColor = 'border-[var(--color-dark-border)]';
                let textColor = 'text-white';
                let scale = 1;

                if (isOutOfRange) {
                  bgColor = 'bg-transparent';
                  textColor = 'text-gray-700';
                  borderColor = 'border-gray-800';
                } else if (isFound) {
                  bgColor = 'bg-[var(--color-emerald)] text-black';
                  borderColor = 'border-[var(--color-emerald)] neon-border-green';
                  textColor = 'text-black font-bold';
                  scale = 1.1;
                } else if (isMid) {
                  bgColor = 'bg-[var(--color-blue)] text-white';
                  borderColor = 'border-[var(--color-blue)] neon-border-cyan';
                  textColor = 'text-white font-bold';
                  scale = 1.1;
                }

                return (
                  <motion.div
                    key={`binary-${idx}`}
                    animate={{ scale, opacity: isOutOfRange ? 0.3 : 1 }}
                    onClick={() => handleNodeClick(idx)}
                    className={`relative flex flex-col items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-lg border-2 transition-colors duration-300 ${bgColor} ${borderColor} ${textColor} ${isChallengeMode && !isOutOfRange ? 'cursor-pointer hover:border-[var(--color-amber)] hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]' : ''}`}
                  >
                    <span className="text-base md:text-xl font-mono">{num}</span>
                    <span className="absolute -bottom-6 text-[10px] font-mono text-gray-500">{idx}</span>
                    
                    {/* Pointers */}
                    {isSearching && idx === currentBStep.left && !isOutOfRange && !currentBStep.found && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-6 text-[10px] font-mono text-[var(--color-amber)]">L</motion.div>
                    )}
                    {isSearching && idx === currentBStep.right && !isOutOfRange && !currentBStep.found && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-6 text-[10px] font-mono text-[var(--color-amber)]">R</motion.div>
                    )}
                    {isSearching && isMid && !currentBStep.found && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-6 text-[10px] font-mono text-[var(--color-blue)]">M</motion.div>
                    )}

                    {/* POV Bubble */}
                    {showPov && isMid && (
                      <ThoughtBubble text={currentBStep.povMessage} visible={true} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Linear Search Array (Only visible in Race Mode) */}
          {isRacing && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col items-center w-full">
              <h4 className="text-gray-400 font-bold mb-4 font-mono uppercase tracking-widest text-sm">Linear Search O(n)</h4>
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {array.map((num, idx) => {
                  const isCurrent = isSearching && idx === currentLStep.index;
                  const isFound = isSearching && currentLStep.found && idx === currentLStep.index;
                  const isPassed = isSearching && idx < currentLStep.index;

                  let bgColor = 'bg-[var(--color-dark-surface)]';
                  let borderColor = 'border-[var(--color-dark-border)]';
                  let textColor = 'text-white';
                  let scale = 1;

                  if (isPassed && !isFound) {
                    bgColor = 'bg-transparent';
                    textColor = 'text-gray-700';
                    borderColor = 'border-gray-800';
                  } else if (isFound) {
                    bgColor = 'bg-[var(--color-emerald)] text-black';
                    borderColor = 'border-[var(--color-emerald)] neon-border-green';
                    textColor = 'text-black font-bold';
                    scale = 1.1;
                  } else if (isCurrent) {
                    bgColor = 'bg-gray-700 text-white';
                    borderColor = 'border-gray-500';
                    textColor = 'text-white font-bold';
                    scale = 1.1;
                  }

                  return (
                    <motion.div
                      key={`linear-${idx}`}
                      animate={{ scale, opacity: isPassed ? 0.3 : 1 }}
                      className={`relative flex flex-col items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-lg border-2 transition-colors duration-300 ${bgColor} ${borderColor} ${textColor}`}
                    >
                      <span className="text-base md:text-xl font-mono">{num}</span>
                      <span className="absolute -bottom-6 text-[10px] font-mono text-gray-500">{idx}</span>
                      {isSearching && isCurrent && !isFound && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-6 text-[10px] font-mono text-gray-400">▼</motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Time Travel Slider */}
          {isSearching && !isChallengeMode && binarySteps.length > 0 && (
            <div className="w-full max-w-2xl">
              <StepTimeline 
                current={currentIndex} 
                total={binarySteps.length - 1} 
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
              <CodeSyncPanel activeLine={isSearching ? currentBStep.codeLine : -1} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
