import { useState } from "react";
import RatingSlider from "./RatingSlider";
import { Save, Code2 } from "lucide-react";

const CRITERIA = [
  { key: "ui_quality", label: "UI Quality" },
  { key: "component_structure", label: "Component Structure" },
  { key: "state_handling", label: "State Handling" },
  { key: "edge_cases", label: "Edge-Case Handling" },
  { key: "responsiveness", label: "Responsiveness" },
  { key: "accessibility", label: "Accessibility" },
];

const DEFAULT_EVAL = Object.fromEntries(CRITERIA.map(c => [c.key, 0]));

export default function AssignmentEvalPanel({ candidate, onUpdate }) {
  const [eval_, setEval] = useState(candidate.assignment_eval || DEFAULT_EVAL);
  const [saved, setSaved] = useState(false);

  const setField = (key, val) => {
    setEval(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const avgScore = () => {
    const vals = Object.values(eval_).filter(v => v > 0);
    if (!vals.length) return null;
    return ((vals.reduce((a, b) => a + b, 0) / vals.length) * 20).toFixed(0);
  };

  const handleSave = () => {
    const avg = avgScore();
    const updates = { assignment_eval: eval_ };
    if (avg !== null) updates.assignment_score = Number(avg);
    onUpdate(updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const avg = avgScore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-electric-400" />
          <span className="font-display font-semibold text-sm text-slate-200">Assignment Evaluation</span>
        </div>
        {avg !== null && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Computed score:</span>
            <span className="font-mono text-sm font-bold text-electric-400">{avg}/100</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {CRITERIA.map(({ key, label }) => (
          <RatingSlider
            key={key}
            label={label}
            value={eval_[key]}
            onChange={val => setField(key, val)}
          />
        ))}
      </div>

      <button
        onClick={handleSave}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-display font-semibold transition-all duration-200 ${
          saved
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "btn-primary"
        }`}
      >
        <Save size={13} />
        {saved ? "Saved! Score Updated" : "Save Evaluation"}
      </button>

      <p className="text-xs text-slate-600 font-body text-center">
        Saving will update the candidate's assignment score
      </p>
    </div>
  );
}
