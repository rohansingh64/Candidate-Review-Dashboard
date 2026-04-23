import { Star, GitCompare, ChevronUp, ChevronDown } from "lucide-react";
import { getScoreColor, getScoreBarColor } from "../data/candidates";

const ScoreCell = ({ score }) => (
  <div className="flex items-center gap-2 min-w-0">
    <div className="score-bar flex-1 hidden sm:block">
      <div className={`score-bar-fill ${getScoreBarColor(score)}`} style={{ width: `${score}%` }} />
    </div>
    <span className={`font-mono text-sm font-medium flex-shrink-0 ${getScoreColor(score)}`}>{score}</span>
  </div>
);

const PriorityBadge = ({ priority }) => {
  const map = {
    P0: "tag-p0", P1: "tag-p1", P2: "tag-p2", P3: "tag-p3"
  };
  return <span className={map[priority] || ""}>{priority}</span>;
};

const SortIcon = ({ field, sortBy, sortDir }) => {
  if (sortBy !== field) return <div className="w-3 h-3 opacity-0" />;
  return sortDir === "desc" ? <ChevronDown size={12} className="text-electric-400" /> : <ChevronUp size={12} className="text-electric-400" />;
};

export default function CandidateTable({ candidates, selectedId, onSelect, compareIds, onToggleCompare, onShortlist, sortBy, setSortBy, sortDir, setSortDir }) {
  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(field); setSortDir("desc"); }
  };

  const Th = ({ field, label, className = "" }) => (
    <th
      className={`px-3 py-3 text-left text-xs font-display font-semibold text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-slate-200 transition-colors ${className}`}
      onClick={() => field && handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {field && <SortIcon field={field} sortBy={sortBy} sortDir={sortDir} />}
      </div>
    </th>
  );

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-obsidian-700/60">
              <Th label="" className="w-10" />
              <Th field="name" label="Candidate" />
              <Th field="assignment" label="Assign." />
              <Th field="video" label="Video" className="hidden md:table-cell" />
              <Th field="ats" label="ATS" className="hidden lg:table-cell" />
              <Th label="GitHub" className="hidden xl:table-cell" />
              <Th label="Comm." className="hidden xl:table-cell" />
              <Th field="priority" label="Priority" />
              <Th label="Status" className="hidden sm:table-cell" />
              <Th label="" className="w-20" />
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-slate-500 font-body">
                  No candidates match your filters
                </td>
              </tr>
            ) : (
              candidates.map((c, idx) => {
                const isSelected = c.id === selectedId;
                const isCompare = compareIds.includes(c.id);

                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelect(c.id)}
                    className={`border-b border-obsidian-700/30 cursor-pointer transition-all duration-150 group
                      ${isSelected
                        ? "bg-electric-500/10 border-electric-500/20"
                        : "hover:bg-obsidian-800/50"
                      }`}
                  >
                    {/* Row number */}
                    <td className="px-3 py-3 text-xs font-mono text-slate-600 text-center">{idx + 1}</td>

                    {/* Name + College */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-display font-bold flex-shrink-0 ${
                          c.priority === "P0" ? "bg-emerald-500/20 text-emerald-400" :
                          c.priority === "P1" ? "bg-amber-500/20 text-amber-400" :
                          c.priority === "P2" ? "bg-coral-500/20 text-coral-400" :
                          "bg-crimson-500/20 text-crimson-400"
                        }`}>
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-display font-semibold text-slate-200 text-sm truncate max-w-[140px]">{c.name}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[140px]">{c.college}</div>
                        </div>
                      </div>
                    </td>

                    {/* Scores */}
                    <td className="px-3 py-3 w-28"><ScoreCell score={c.assignment_score} /></td>
                    <td className="px-3 py-3 w-24 hidden md:table-cell"><ScoreCell score={c.video_score} /></td>
                    <td className="px-3 py-3 w-24 hidden lg:table-cell"><ScoreCell score={c.ats_score} /></td>
                    <td className="px-3 py-3 w-20 hidden xl:table-cell">
                      <span className={`font-mono text-sm ${getScoreColor(c.github_score)}`}>{c.github_score}</span>
                    </td>
                    <td className="px-3 py-3 w-20 hidden xl:table-cell">
                      <span className={`font-mono text-sm ${getScoreColor(c.communication_score)}`}>{c.communication_score}</span>
                    </td>

                    {/* Priority */}
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <PriorityBadge priority={c.priority} />
                        <div className="text-xs font-mono text-slate-500">{c.priorityScore.toFixed(1)}</div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded font-body ${
                        c.status === "reviewed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-obsidian-700 text-slate-500 border border-obsidian-600/50"
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onShortlist(c.id)}
                          title="Toggle shortlist"
                          className={`p-1.5 rounded-lg transition-all ${
                            c.shortlisted
                              ? "text-amber-400 bg-amber-500/15"
                              : "text-slate-600 hover:text-amber-400 hover:bg-amber-500/10"
                          }`}
                        >
                          <Star size={13} fill={c.shortlisted ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => onToggleCompare(c.id)}
                          title="Add to compare"
                          className={`p-1.5 rounded-lg transition-all ${
                            isCompare
                              ? "text-electric-400 bg-electric-500/15"
                              : "text-slate-600 hover:text-electric-400 hover:bg-electric-500/10"
                          }`}
                        >
                          <GitCompare size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2.5 border-t border-obsidian-700/40 flex items-center justify-between">
        <span className="text-xs text-slate-600 font-body">{candidates.length} candidates shown</span>
        <span className="text-xs text-slate-600 font-body">Click a row to view details</span>
      </div>
    </div>
  );
}
