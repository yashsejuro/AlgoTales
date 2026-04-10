interface StepTimelineProps {
  current: number;
  total: number;
  onChange: (step: number) => void;
}

export default function StepTimeline({ current, total, onChange }: StepTimelineProps) {
  return (
    <div className="w-full flex items-center gap-4 mt-8 bg-white/5 p-4 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
      <span className="text-xs font-mono text-gray-400 whitespace-nowrap">Step {current} / {total}</span>
      <input 
        type="range" 
        min={0} 
        max={total} 
        value={current} 
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-neon-cyan)]"
      />
    </div>
  );
}
