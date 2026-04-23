export default function ScoreRing({ score, label, size = 64 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  
  const color = score >= 80 ? "#34d399" : score >= 65 ? "#fbbf24" : score >= 50 ? "#fb923c" : "#f87171";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#1e2d55" strokeWidth={4}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={4}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-white" style={{ fontSize: size * 0.22 }}>
          {score}
        </span>
      </div>
      <span className="text-xs text-slate-500 font-body text-center leading-tight">{label}</span>
    </div>
  );
}
