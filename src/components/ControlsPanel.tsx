import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

interface ControlsPanelProps {
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export default function ControlsPanel({
  isPlaying,
  speed,
  onPlayPause,
  onStep,
  onReset,
  onSpeedChange
}: ControlsPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-gray-500 uppercase">Controls</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Speed: {speed}x</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.5"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-24 accent-[var(--color-neon-cyan)]"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onReset}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        
        <button
          onClick={onPlayPause}
          className="p-4 rounded-full bg-[var(--color-neon-cyan)] text-black hover:scale-105 transition-transform neon-border-cyan"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black" />}
        </button>
        
        <button
          onClick={onStep}
          disabled={isPlaying}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Step Forward"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
