import { X } from "lucide-react";
import { getPriorityMeta, getScoreColor, getScoreBarColor } from "../data/candidates";

const METRICS = [
  { label: "Assignment", key: "assignment_score", weight: "30%" },
  { label: "Video", key: "video_score", weight: "25%" },
  { label: "ATS", key: "ats_score", weight: "20%" },
  { label: "GitHub", key: "github_score", weight: "15%" },
  { label: "Communication", key: "communication_score", weight: "10%" },
];

const ScoreBar = ({ score, highlight }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-obsidian-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(score)}`}
        style={{ width: `${score}%` }}
      />
    </div>
    <span className={`font-mono text-sm font-bold w-8 text-right ${highlight ? getScoreColor(score) : "text-slate-400"}`}>
      {score}
    </span>
  </div>
);

export default function CompareModal({ candidates, onClose, onRemove }) {
  if (!candidates.length) return null;

  // Find best score per metric
  const getBest = (key) => Math.max(...candidates.map(c => c[key]));

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-3 sm:inset-8 md:inset-12 z-50 flex flex-col glass-card rounded-2xl border border-obsidian-700/60 overflow-hidden animate-fade-in max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-obsidian-700/50 flex-shrink-0">
          <div>
            <h2 className="font-display font-bold text-white">Candidate Comparison</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-body">Green highlights show the best score per metric</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-obsidian-700 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          {/* Candidate headers */}
          <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: `180px repeat(${candidates.length}, 1fr)` }}>
            <div />
            {candidates.map(c => {
              const meta = getPriorityMeta(c.priority);
              return (
                <div key={c.id} className="glass-card rounded-xl p-3 relative">
                  <button
                    onClick={() => onRemove(c.id)}
                    className="absolute top-2 right-2 p-1 text-slate-600 hover:text-crimson-400 hover:bg-crimson-500/10 rounded transition-all"
                  >
                    <X size={11} />
                  </button>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-base font-display font-bold mb-2 ${
                    c.priority === "P0" ? "bg-emerald-500/20 text-emerald-400" :
                    c.priority === "P1" ? "bg-amber-500/20 text-amber-400" :
                    c.priority === "P2" ? "bg-coral-500/20 text-coral-400" :
                    "bg-crimson-500/20 text-crimson-400"
                  }`}>
                    {c.name.charAt(0)}
                  </div>
                  <div className="font-display font-semibold text-white text-sm truncate pr-4">{c.name}</div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">{c.college}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={meta.tagClass}>{c.priority}</span>
                    <span className="font-mono text-xs text-slate-500">{c.priorityScore.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Score rows */}
          <div className="space-y-2">
            {METRICS.map(({ label, key, weight }) => {
              const best = getBest(key);
              return (
                <div
                  key={key}
                  className="grid gap-3 items-center py-2 border-b border-obsidian-700/30"
                  style={{ gridTemplateColumns: `180px repeat(${candidates.length}, 1fr)` }}
                >
                  <div>
                    <span className="text-sm font-body text-slate-300">{label}</span>
                    <span className="text-xs text-slate-600 font-mono ml-2">{weight}</span>
                  </div>
                  {candidates.map(c => {
                    const isBest = c[key] === best && candidates.length > 1;
                    return (
                      <div key={c.id} className={`p-2 rounded-lg transition-all ${isBest ? "bg-emerald-500/8 border border-emerald-500/20" : ""}`}>
                        <ScoreBar score={c[key]} highlight={isBest} />
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Priority score row */}
            <div
              className="grid gap-3 items-center pt-3"
              style={{ gridTemplateColumns: `180px repeat(${candidates.length}, 1fr)` }}
            >
              <div>
                <span className="text-sm font-display font-semibold text-slate-200">Priority Score</span>
              </div>
              {candidates.map(c => {
                const bestPs = Math.max(...candidates.map(x => x.priorityScore));
                const isBest = c.priorityScore === bestPs && candidates.length > 1;
                return (
                  <div key={c.id} className={`p-2 rounded-lg ${isBest ? "bg-electric-500/10 border border-electric-500/20" : ""}`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-lg font-bold ${isBest ? "text-electric-400" : "text-slate-300"}`}>
                        {c.priorityScore.toFixed(1)}
                      </span>
                      <span className={getPriorityMeta(c.priority).tagClass}>{c.priority}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
