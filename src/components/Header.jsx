import { Users, GitCompare, X, Cpu } from "lucide-react";

export default function Header({ compareCount, onOpenCompare, onClearCompare }) {
  return (
    <header className="sticky top-0 z-40 border-b border-obsidian-700/60 bg-obsidian-950/90 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-electric-500/20 border border-electric-500/40 flex items-center justify-center">
              <Cpu size={14} className="text-electric-400" />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">TalentOS</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-obsidian-600" />
          <span className="hidden sm:block text-slate-500 text-sm font-body">Hiring Dashboard</span>
        </div>

        <div className="flex items-center gap-2">
          {compareCount > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 bg-electric-500/15 hover:bg-electric-500/25 border border-electric-500/30 text-electric-400 text-sm px-3 py-1.5 rounded-lg transition-all duration-200 font-display font-medium"
              >
                <GitCompare size={14} />
                <span>Compare</span>
                <span className="bg-electric-500 text-white text-xs rounded px-1.5 py-0.5 font-mono">{compareCount}</span>
              </button>
              <button
                onClick={onClearCompare}
                className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-obsidian-700 rounded-lg transition-all"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Users size={14} />
            <span className="hidden sm:inline font-body">Reviewer Portal</span>
          </div>
        </div>
      </div>
    </header>
  );
}
