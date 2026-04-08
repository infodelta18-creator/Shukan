type DayData = { kcal: number; protein: number; carbs: number; fat: number };

function getColor(kcal: number, goal: number) {
  if (kcal === 0) return "var(--color-muted)";
  const ratio = kcal / goal;
  if (ratio >= 0.9 && ratio <= 1.1) return "#22c55e";
  if (ratio >= 0.75 && ratio <= 1.25) return "#eab308";
  return "#ef4444";
}

export default function ComplianceHeatmap({
  data,
  goalKcal,
  months,
}: {
  data: Record<string, DayData>;
  goalKcal: number;
  months: number;
}) {
  const end = new Date();
  const start = new Date();
  start.setMonth(end.getMonth() - months);
  start.setDate(start.getDate() - start.getDay());

  const weeks: string[][] = [];
  const d = new Date(start);
  while (d <= end) {
    const week: string[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(d.toISOString().slice(0, 10));
      d.setDate(d.getDate() + 1);
    }
    weeks.push(week);
  }

  const cellSize = 10;
  const gap = 2;
  const width = weeks.length * (cellSize + gap);
  const height = 7 * (cellSize + gap);

  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground mb-2">
        Calorie Compliance ({months}mo)
      </p>
      <div className="overflow-x-auto">
        <svg
          width={width}
          height={height + 15}
          viewBox={`0 0 ${width} ${height + 15}`}
        >
          {["M", "", "W", "", "F", "", ""].map((label, i) => (
            <text
              key={i}
              x={-2}
              y={i * (cellSize + gap) + cellSize - 1}
              fontSize="7"
              fill="currentColor"
              className="text-muted-foreground"
              textAnchor="end"
            >
              {label}
            </text>
          ))}
          {weeks.map((week, wi) =>
            week.map((date, di) => {
              const dayData = data[date];
              const kcal = dayData?.kcal ?? 0;
              const today = new Date().toISOString().slice(0, 10);
              if (date > today) return null;
              return (
                <rect
                  key={date}
                  x={wi * (cellSize + gap)}
                  y={di * (cellSize + gap)}
                  width={cellSize}
                  height={cellSize}
                  rx="2"
                  fill={getColor(kcal, goalKcal)}
                  opacity={kcal === 0 ? 0.3 : 1}
                >
                  <title>
                    {date}: {kcal} kcal
                  </title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
        <span>Less</span>
        {["#ef4444", "#eab308", "#22c55e"].map((c) => (
          <span
            key={c}
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: c }}
          />
        ))}
        <span>On target</span>
      </div>
    </div>
  );
}
