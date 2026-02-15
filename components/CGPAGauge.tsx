interface Props {
  value: number;
  max?: number;
  size?: number;
  label?: string;
}

const CGPAGauge = ({ value, max = 4, size = 180, label = "CGPA" }: Props) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / max, 1);
  const strokeDashoffset = circumference * (1 - percentage);

  const getColor = () => {
    if (value >= 3.75) return "hsl(160, 60%, 45%)";
    if (value >= 3.25) return "hsl(199, 89%, 48%)";
    if (value >= 2.75) return "hsl(45, 90%, 50%)";
    if (value >= 2.0) return "hsl(25, 90%, 55%)";
    return "hsl(0, 70%, 55%)";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="drop-shadow-lg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-700 ease-out"
        />
        <text
          x={size / 2}
          y={size / 2 - 8}
          textAnchor="middle"
          className="fill-foreground text-3xl font-bold"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {value > 0 ? value.toFixed(2) : "—"}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 18}
          textAnchor="middle"
          className="fill-muted-foreground text-sm"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {label}
        </text>
      </svg>
    </div>
  );
};

export default CGPAGauge;
