const DOT_COLORS = ["bg-crimson-500", "bg-coral-400", "bg-amber-400", "bg-electric-400", "bg-emerald-400"];

export default function RatingSlider({ label, value, onChange, max = 5 }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-body text-slate-300">{label}</label>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${value ? DOT_COLORS[value - 1] : "bg-obsidian-600"}`} />
          <span className="font-mono text-sm font-medium text-slate-200">{value || "—"}<span className="text-slate-500">/{max}</span></span>
        </div>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: max }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            onClick={() => onChange(value === n ? 0 : n)}
            className={`flex-1 h-8 rounded-md text-xs font-mono font-semibold transition-all duration-150 border ${
              value >= n
                ? `${DOT_COLORS[n - 1]} bg-opacity-20 border-transparent text-white`
                : "bg-obsidian-800 border-obsidian-600/50 text-slate-600 hover:border-obsidian-500 hover:text-slate-400"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
