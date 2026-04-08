import SimpleBarChart from "./SimpleBarChart";

type DayData = { kcal: number; protein: number; carbs: number; fat: number };

export default function ProteinTrendCard({
  data,
  dates,
  goalProtein,
}: {
  data: Record<string, DayData>;
  dates: string[];
  goalProtein: number | undefined;
}) {
  const chartData = dates.map((date) => ({
    label: new Date(date + "T12:00:00")
      .toLocaleDateString("en-US", { weekday: "narrow" })
      .charAt(0),
    value: data[date]?.protein ?? 0,
  }));

  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">Daily Protein</p>
      <SimpleBarChart
        data={chartData}
        color="#3b82f6"
        maxValue={goalProtein ? goalProtein * 1.2 : undefined}
      />
    </div>
  );
}
