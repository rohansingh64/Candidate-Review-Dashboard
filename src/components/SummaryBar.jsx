import { Users, CheckCircle, Star, Clock, TrendingUp } from "lucide-react";

const Stat = ({ icon: Icon, label, value, sub, accent }) => (
  <div className="glass-card rounded-xl p-3 sm:p-4 flex items-center gap-3">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}>
      <Icon size={16} />
    </div>
    <div className="min-w-0">
      <div className="text-xl sm:text-2xl font-display font-bold text-white leading-none">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5 font-body truncate">{label}</div>
      {sub && <div className="text-xs text-slate-600 mt-0.5 font-body">{sub}</div>}
    </div>
  </div>
);

const PriorityPill = ({ label, count, tagClass }) => (
  <div className="flex items-center justify-between">
    <span className={tagClass}>{label}</span>
    <span className="text-slate-300 font-mono text-sm font-medium">{count}</span>
  </div>
);

export default function SummaryBar({ summary }) {
  return (
    <div className="space-y-3 animate-fade-in">
      {/* Main stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat icon={Users} label="Total Candidates" value={summary.total}
          accent="bg-electric-500/15 text-electric-400 border border-electric-500/20" />
        <Stat icon={Clock} label="Pending Review" value={summary.pending}
          accent="bg-amber-500/15 text-amber-400 border border-amber-500/20" />
        <Stat icon={CheckCircle} label="Reviewed" value={summary.reviewed}
          accent="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" />
        <Stat icon={Star} label="Shortlisted" value={summary.shortlisted}
          accent="bg-coral-500/15 text-coral-400 border border-coral-500/20" />
      </div>

      {/* Priority distribution */}
      <div className="glass-card rounded-xl p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-slate-500" />
          <span className="text-xs font-display font-semibold text-slate-400 uppercase tracking-wider">Priority Distribution</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2">
          <PriorityPill label="P0 — Interview" count={summary.p0} tagClass="tag-p0" />
          <PriorityPill label="P1 — Shortlist" count={summary.p1} tagClass="tag-p1" />
          <PriorityPill label="P2 — Review Later" count={summary.p2} tagClass="tag-p2" />
          <PriorityPill label="P3 — Reject" count={summary.p3} tagClass="tag-p3" />
        </div>
        {/* Visual bar */}
        <div className="mt-3 flex h-2 rounded-full overflow-hidden gap-px">
          {summary.p0 > 0 && <div className="bg-emerald-400" style={{ flex: summary.p0 }} />}
          {summary.p1 > 0 && <div className="bg-amber-400" style={{ flex: summary.p1 }} />}
          {summary.p2 > 0 && <div className="bg-coral-400" style={{ flex: summary.p2 }} />}
          {summary.p3 > 0 && <div className="bg-crimson-400" style={{ flex: summary.p3 }} />}
        </div>
      </div>
    </div>
  );
}
