import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { MealSlot } from "@/hooks/useDailyLog";
import { MEAL_SLOTS, MEAL_SLOT_LABELS } from "@/hooks/useDailyLog";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function yesterday(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export default function CopyMealPage() {
  const navigate = useNavigate();
  const { date, mealSlot } = useParams<{ date: string; mealSlot: string }>();
  const targetSlot = mealSlot as MealSlot;

  const [sourceDate, setSourceDate] = useState(() => yesterday(date!));
  const [sourceSlot, setSourceSlot] = useState<MealSlot>(targetSlot);

  const entries = useQuery(api.mealEntries.listByDate, { date: sourceDate });
  const copyMeal = useMutation(api.mealEntries.copyMeal);

  const preview = entries?.filter((e) => e.mealSlot === sourceSlot) ?? [];

  const handleCopy = async () => {
    if (!date) return;
    await copyMeal({
      sourceDate,
      sourceMealSlot: sourceSlot,
      targetDate: date,
      targetMealSlot: targetSlot,
    });
    navigate(-1);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">
          Copy to {MEAL_SLOT_LABELS[targetSlot]}
        </h1>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <Label>Source Date</Label>
          <Input
            type="date"
            value={sourceDate}
            onChange={(e) => setSourceDate(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label>Source Meal</Label>
          <div className="flex gap-1 flex-wrap">
            {MEAL_SLOTS.map((s) => (
              <button
                key={s}
                onClick={() => setSourceSlot(s)}
                className={`px-3 py-1.5 text-sm rounded-full ${
                  sourceSlot === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {MEAL_SLOT_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="px-4 py-2 border-b bg-muted/50">
          <span className="text-sm font-medium">Preview</span>
        </div>
        {preview.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground text-center">
            No entries found
          </p>
        ) : (
          preview.map((entry) => (
            <div
              key={entry._id}
              className="flex justify-between px-4 py-2 border-b last:border-b-0 text-sm"
            >
              <span>{entry.foodName}</span>
              <span className="text-muted-foreground">{entry.kcal} kcal</span>
            </div>
          ))
        )}
      </div>

      <Button
        className="w-full"
        disabled={preview.length === 0}
        onClick={handleCopy}
      >
        Copy {preview.length} {preview.length === 1 ? "entry" : "entries"}
      </Button>
    </div>
  );
}
