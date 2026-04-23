import { useState } from "react";
import RatingSlider from "./RatingSlider";
import { Save, Video, Plus, Trash2 } from "lucide-react";

const CRITERIA = [
  { key: "clarity", label: "Clarity" },
  { key: "confidence", label: "Confidence" },
  { key: "architecture", label: "Architecture Explanation" },
  { key: "tradeoffs", label: "Tradeoff Reasoning" },
  { key: "communication", label: "Communication" },
];

const DEFAULT_EVAL = Object.fromEntries(CRITERIA.map(c => [c.key, 0]));

export default function VideoEvalPanel({ candidate, onUpdate }) {
  const [eval_, setEval] = useState(candidate.video_eval || DEFAULT_EVAL);
  const [timestamps, setTimestamps] = useState(candidate.video_timestamps || []);
  const [newTs, setNewTs] = useState({ time: "", note: "" });
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

  const addTimestamp = () => {
    if (!newTs.time || !newTs.note) return;
    setTimestamps(prev => [...prev, { ...newTs, id: Date.now() }]);
    setNewTs({ time: "", note: "" });
  };

  const removeTs = (id) => setTimestamps(prev => prev.filter(t => t.id !== id));

  const handleSave = () => {
    const avg = avgScore();
    const updates = { video_eval: eval_, video_timestamps: timestamps };
    if (avg !== null) updates.video_score = Number(avg);
    onUpdate(updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const avg = avgScore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video size={14} className="text-coral-400" />
          <span className="font-display font-semibold text-sm text-slate-200">Video Evaluation</span>
        </div>
        {avg !== null && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Computed score:</span>
            <span className="font-mono text-sm font-bold text-coral-400">{avg}/100</span>
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

      {/* Timestamp notes */}
      <div className="space-y-2">
        <span className="text-xs font-display font-semibold text-slate-400 uppercase tracking-wider">Timestamp Notes</span>

        {timestamps.map(ts => (
          <div key={ts.id} className="flex items-start gap-2 bg-obsidian-800/50 rounded-lg px-3 py-2 group">
            <span className="font-mono text-xs text-electric-400 flex-shrink-0 mt-0.5">{ts.time}</span>
            <span className="text-sm text-slate-300 flex-1 font-body">{ts.note}</span>
            <button onClick={() => removeTs(ts.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-crimson-400 transition-all">
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="00:00"
            value={newTs.time}
            onChange={e => setNewTs(p => ({ ...p, time: e.target.value }))}
            className="input-field w-20 text-center font-mono"
          />
          <input
            type="text"
            placeholder="Add note…"
            value={newTs.note}
            onChange={e => setNewTs(p => ({ ...p, note: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && addTimestamp()}
            className="input-field flex-1"
          />
          <button onClick={addTimestamp} className="btn-ghost px-2.5">
            <Plus size={14} />
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-display font-semibold transition-all duration-200 ${
          saved
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-coral-500 hover:bg-coral-400 text-white hover:shadow-lg hover:shadow-coral-500/20"
        }`}
      >
        <Save size={13} />
        {saved ? "Saved! Score Updated" : "Save Evaluation"}
      </button>
    </div>
  );
}
