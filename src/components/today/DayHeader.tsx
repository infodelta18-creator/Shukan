import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DailyTotals } from "@/hooks/useDailyLog";
import type { Doc } from "../../../convex/_generated/dataModel";

export default function DayHeader({
  date,
  onPrev,
  onNext,
  totals,
  goals,
}: {
  date: string;
  onPrev: () => void;
  onNext: () => void;
  totals: DailyTotals;
  goals: Doc<"userGoals"> | null | undefined;
}) {
  const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={onPrev} className="p-1">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="font-semibold">{formatted}</h2>
        <button onClick={onNext} className="p-1">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="rounded-lg bg-muted p-3">
        <div className="text-center">
          <span className="text-2xl font-bold">{Math.round(totals.kcal)}</span>
          {goals && (
            <span className="text-muted-foreground">
              {" "}
              / {goals.dailyKcal} kcal
            </span>
          )}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <span className="font-medium">
              {Math.round(totals.protein * 10) / 10}g
            </span>
            <p className="text-muted-foreground">Protein</p>
          </div>
          <div>
            <span className="font-medium">
              {Math.round(totals.carbs * 10) / 10}g
            </span>
            <p className="text-muted-foreground">Carbs</p>
          </div>
          <div>
            <span className="font-medium">
              {Math.round(totals.fat * 10) / 10}g
            </span>
            <p className="text-muted-foreground">Fat</p>
          </div>
        </div>
      </div>
    </div>
  );
}
