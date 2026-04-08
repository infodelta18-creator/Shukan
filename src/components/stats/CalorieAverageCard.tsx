type DayData = { kcal: number; protein: number; carbs: number; fat: number };

export default function CalorieAverageCard({
  data,
  label,
}: {
  data: Record<string, DayData>;
  label: string;
}) {
  const days = Object.values(data);
  const count = days.length || 1;
  const avg = Math.round(days.reduce((s, d) => s + d.kcal, 0) / count);

  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{avg} kcal/day</p>
      <p className="text-xs text-muted-foreground mt-1">
        Based on {days.length} days of data
      </p>
    </div>
  );
}
