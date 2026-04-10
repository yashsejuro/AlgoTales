const DEFAULT_CODE = [
  "function binarySearch(arr, target) {",
  "  let left = 0;",
  "  let right = arr.length - 1;",
  "",
  "  while (left <= right) {",
  "    let mid = Math.floor((left + right) / 2);",
  "",
  "    if (arr[mid] === target) return mid;",
  "    if (arr[mid] < target) left = mid + 1;",
  "    else right = mid - 1;",
  "  }",
  "  return -1;",
  "}"
];

export default function CodeSyncPanel({ 
  activeLine, 
  code = DEFAULT_CODE, 
  filename = "binarySearch.js" 
}: { 
  activeLine: number, 
  code?: string[], 
  filename?: string 
}) {
  return (
    <div className="bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 font-mono text-xs text-gray-300 w-full max-w-sm shadow-2xl">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-gray-500">{filename}</span>
      </div>
      <div className="flex flex-col">
        {code.map((line, i) => (
          <div 
            key={i} 
            className={`px-2 py-1 rounded transition-colors duration-300 ${
              activeLine === i 
                ? 'bg-[var(--color-blue)]/20 text-[var(--color-neon-cyan)] border-l-2 border-[var(--color-neon-cyan)]' 
                : 'border-l-2 border-transparent hover:bg-white/5'
            }`}
          >
            <span className="inline-block w-6 text-gray-600 select-none">{i}</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
