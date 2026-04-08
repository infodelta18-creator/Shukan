export default function SimpleBarChart({
  data,
  color,
  maxValue,
}: {
  data: { label: string; value: number }[];
  color: string;
  maxValue?: number;
}) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);
  const barWidth = Math.max(100 / data.length - 2, 4);
  const gap = 100 / data.length;

  return (
    <svg viewBox="0 0 100 60" className="w-full h-32" preserveAspectRatio="none">
      {data.map((d, i) => {
        const height = (d.value / max) * 50;
        return (
          <g key={i}>
            <rect
              x={i * gap + (gap - barWidth) / 2}
              y={50 - height}
              width={barWidth}
              height={height}
              fill={color}
              rx="1"
            />
            <text
              x={i * gap + gap / 2}
              y={58}
              textAnchor="middle"
              fontSize="3"
              fill="currentColor"
              className="text-muted-foreground"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
