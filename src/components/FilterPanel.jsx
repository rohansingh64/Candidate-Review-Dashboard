import { Search, SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";
import { useState } from "react";

const RangeFilter = ({ label, minKey, maxKey, filters, setFilters }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-xs font-display font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      <span className="text-xs font-mono text-slate-500">{filters[minKey]}–{filters[maxKey]}</span>
    </div>
    <div className="flex gap-2 items-center">
      <input
        type="range" min="0" max="100"
        value={filters[minKey]}
        onChange={e => setFilters(f => ({ ...f, [minKey]: Math.min(Number(e.target.value), f[maxKey]) }))}
        className="flex-1 accent-electric-500 h-1"
      />
      <input
        type="range" min="0" max="100"
        value={filters[maxKey]}
        onChange={e => setFilters(f => ({ ...f, [maxKey]: Math.max(Number(e.target.value), f[minKey]) }))}
        className="flex-1 accent-electric-500 h-1"
      />
    </div>
    <div className="flex gap-2">
      <input
        type="number" min="0" max="100"
        value={filters[minKey]}
        onChange={e => setFilters(f => ({ ...f, [minKey]: Math.min(Number(e.target.value), f[maxKey]) }))}
        className="input-field w-full text-center"
        placeholder="Min"
      />
      <input
        type="number" min="0" max="100"
        value={filters[maxKey]}
        onChange={e => setFilters(f => ({ ...f, [maxKey]: Math.max(Number(e.target.value), f[minKey]) }))}
        className="input-field w-full text-center"
        placeholder="Max"
      />
    </div>
  </div>
);

export default function FilterPanel({ filters, setFilters, search, setSearch, sortBy, setSortBy, sortDir, setSortDir, resultCount }) {
  const [open, setOpen] = useState(true);

  const resetFilters = () => {
    setFilters({
      assignmentMin: 0, assignmentMax: 100,
      videoMin: 0, videoMax: 100,
      atsMin: 0, atsMax: 100,
      status: "all", priority: "all", shortlisted: false
    });
    setSearch("");
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search name or college…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field w-full pl-9"
        />
      </div>

      {/* Filter card */}
      <div className="glass-card rounded-xl overflow-hidden">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-obsidian-700/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-electric-400" />
            <span className="font-display font-semibold text-sm text-slate-200">Filters</span>
            <span className="font-mono text-xs text-slate-500 bg-obsidian-700 px-1.5 py-0.5 rounded">{resultCount}</span>
          </div>
          <ChevronDown size={14} className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="px-4 pb-4 space-y-4 border-t border-obsidian-700/50">
            <div className="pt-3">
              <RangeFilter label="Assignment Score" minKey="assignmentMin" maxKey="assignmentMax" filters={filters} setFilters={setFilters} />
            </div>
            <RangeFilter label="Video Score" minKey="videoMin" maxKey="videoMax" filters={filters} setFilters={setFilters} />
            <RangeFilter label="ATS Score" minKey="atsMin" maxKey="atsMax" filters={filters} setFilters={setFilters} />

            <div className="space-y-2">
              <label className="text-xs font-display font-semibold text-slate-400 uppercase tracking-wider">Status</label>
              <select
                value={filters.status}
                onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                className="input-field w-full"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-display font-semibold text-slate-400 uppercase tracking-wider">Priority</label>
              <select
                value={filters.priority}
                onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
                className="input-field w-full"
              >
                <option value="all">All Priorities</option>
                <option value="P0">P0 — Interview</option>
                <option value="P1">P1 — Shortlist</option>
                <option value="P2">P2 — Review Later</option>
                <option value="P3">P3 — Reject</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.shortlisted}
                onChange={e => setFilters(f => ({ ...f, shortlisted: e.target.checked }))}
                className="w-4 h-4 accent-electric-500 rounded"
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors font-body">Shortlisted only</span>
            </label>

            <button onClick={resetFilters} className="btn-ghost w-full flex items-center justify-center gap-1.5 mt-1">
              <RotateCcw size={12} />
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="glass-card rounded-xl px-4 py-3 space-y-3">
        <span className="text-xs font-display font-semibold text-slate-400 uppercase tracking-wider">Sort By</span>
        <div className="space-y-1.5">
          {[
            { key: "priority", label: "Priority Score" },
            { key: "assignment", label: "Assignment" },
            { key: "video", label: "Video" },
            { key: "ats", label: "ATS Score" },
            { key: "name", label: "Name" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                if (sortBy === key) setSortDir(d => d === "desc" ? "asc" : "desc");
                else { setSortBy(key); setSortDir("desc"); }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all font-body ${
                sortBy === key
                  ? "bg-electric-500/15 text-electric-400 border border-electric-500/30"
                  : "text-slate-400 hover:bg-obsidian-700/50 hover:text-slate-300"
              }`}
            >
              <span>{label}</span>
              {sortBy === key && (
                <span className="font-mono text-xs">{sortDir === "desc" ? "↓" : "↑"}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
