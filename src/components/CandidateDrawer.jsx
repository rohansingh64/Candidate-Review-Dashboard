import { useState } from "react";
import { X, Star, CheckCircle, Clock, ChevronRight, Code2, Video, User } from "lucide-react";
import { getPriorityMeta, getScoreColor, getScoreBarColor, calcPriorityScore, getPriorityLabel } from "../data/candidates";
import ScoreRing from "./ScoreRing";
import AssignmentEvalPanel from "./AssignmentEvalPanel";
import VideoEvalPanel from "./VideoEvalPanel";

const TABS = [
  { id: "overview", label: "Overview", Icon: User },
  { id: "assignment", label: "Assignment", Icon: Code2 },
  { id: "video", label: "Video", Icon: Video },
];

const ScoreRow = ({ label, score }) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-slate-400 font-body w-36 flex-shrink-0">{label}</span>
    <div className="flex-1 score-bar">
      <div className={`score-bar-fill ${getScoreBarColor(score)}`} style={{ width: `${score}%` }} />
    </div>
    <span className={`font-mono text-sm font-medium w-8 text-right ${getScoreColor(score)}`}>{score}</span>
  </div>
);

export default function CandidateDrawer({ candidate, onClose, onUpdate }) {
  const [tab, setTab] = useState("overview");

  const priorityScore = calcPriorityScore(candidate);
  const priority = getPriorityLabel(priorityScore);
  const meta = getPriorityMeta(priority);

  const handleMarkReviewed = () => {
    onUpdate({ status: candidate.status === "reviewed" ? "pending" : "reviewed" });
  };

  const handleShortlist = () => {
    onUpdate({ shortlisted: !candidate.shortlisted });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md xl:max-w-lg z-50 flex flex-col glass-card border-l border-obsidian-700/60 animate-slide-in overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-obsidian-700/50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-display font-bold flex-shrink-0 ${
              priority === "P0" ? "bg-emerald-500/20 text-emerald-400" :
              priority === "P1" ? "bg-amber-500/20 text-amber-400" :
              priority === "P2" ? "bg-coral-500/20 text-coral-400" :
              "bg-crimson-500/20 text-crimson-400"
            }`}>
              {candidate.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-white text-lg leading-tight truncate">{candidate.name}</h2>
              <p className="text-sm text-slate-500 truncate">{candidate.college}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-300 hover:bg-obsidian-700 rounded-lg transition-all flex-shrink-0 ml-2">
            <X size={16} />
          </button>
        </div>

        {/* Priority banner */}
        <div className={`px-5 py-2.5 flex items-center justify-between border-b border-obsidian-700/30 flex-shrink-0 ${
          priority === "P0" ? "bg-emerald-500/8" :
          priority === "P1" ? "bg-amber-500/8" :
          priority === "P2" ? "bg-coral-500/8" :
          "bg-crimson-500/8"
        }`}>
          <div className="flex items-center gap-2">
            <span className={meta.tagClass}>{priority}</span>
            <span className="text-sm text-slate-400 font-body">{meta.text}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Score:</span>
            <span className="font-mono font-bold text-white text-sm">{priorityScore.toFixed(1)}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 py-2 border-b border-obsidian-700/40 flex-shrink-0">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-display font-medium transition-all ${
                tab === id
                  ? "bg-electric-500/15 text-electric-400 border border-electric-500/30"
                  : "text-slate-500 hover:text-slate-300 hover:bg-obsidian-700/50"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === "overview" && (
            <div className="space-y-5 animate-fade-in">
              {/* Score rings */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 py-2">
                <ScoreRing score={candidate.assignment_score} label="Assignment" />
                <ScoreRing score={candidate.video_score} label="Video" />
                <ScoreRing score={candidate.ats_score} label="ATS" />
                <ScoreRing score={candidate.github_score} label="GitHub" />
                <ScoreRing score={candidate.communication_score} label="Comm." />
              </div>

              {/* Score bars */}
              <div className="glass-card rounded-xl p-4 space-y-3">
                <span className="text-xs font-display font-semibold text-slate-400 uppercase tracking-wider">Score Breakdown</span>
                <div className="space-y-2.5">
                  <ScoreRow label="Assignment (30%)" score={candidate.assignment_score} />
                  <ScoreRow label="Video (25%)" score={candidate.video_score} />
                  <ScoreRow label="ATS (20%)" score={candidate.ats_score} />
                  <ScoreRow label="GitHub (15%)" score={candidate.github_score} />
                  <ScoreRow label="Communication (10%)" score={candidate.communication_score} />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-display font-semibold text-slate-400 uppercase tracking-wider">Reviewer Notes</label>
                <textarea
                  value={candidate.notes}
                  onChange={e => onUpdate({ notes: e.target.value })}
                  placeholder="Add notes about this candidate…"
                  rows={4}
                  className="input-field w-full resize-none font-body"
                />
              </div>
            </div>
          )}

          {tab === "assignment" && (
            <div className="animate-fade-in">
              <AssignmentEvalPanel candidate={candidate} onUpdate={onUpdate} />
            </div>
          )}

          {tab === "video" && (
            <div className="animate-fade-in">
              <VideoEvalPanel candidate={candidate} onUpdate={onUpdate} />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 px-5 py-3 border-t border-obsidian-700/50 flex-shrink-0">
          <button
            onClick={handleMarkReviewed}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-display font-semibold transition-all ${
              candidate.status === "reviewed"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "btn-ghost"
            }`}
          >
            {candidate.status === "reviewed" ? <CheckCircle size={13} /> : <Clock size={13} />}
            {candidate.status === "reviewed" ? "Reviewed" : "Mark Reviewed"}
          </button>
          <button
            onClick={handleShortlist}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-display font-semibold transition-all ${
              candidate.shortlisted
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "btn-ghost"
            }`}
          >
            <Star size={13} fill={candidate.shortlisted ? "currentColor" : "none"} />
            {candidate.shortlisted ? "Shortlisted" : "Shortlist"}
          </button>
        </div>
      </div>
    </>
  );
}
