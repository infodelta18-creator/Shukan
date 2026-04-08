import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snacks";
export const MEAL_SLOTS: MealSlot[] = [
  "breakfast",
  "lunch",
  "dinner",
  "snacks",
];

export const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snacks: "Snacks",
};

export type DailyTotals = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function useDailyLog(date: string) {
  const entries = useQuery(api.mealEntries.listByDate, { date });
  const quickAdds = useQuery(api.quickAdds.listByDate, { date });
  const goals = useQuery(api.userGoals.get);

  const entriesBySlot = (slot: MealSlot) =>
    entries?.filter((e) => e.mealSlot === slot) ?? [];

  const quickAddsBySlot = (slot: MealSlot) =>
    quickAdds?.filter((q) => q.mealSlot === slot) ?? [];

  const allItems: Array<Doc<"mealEntries"> | Doc<"quickAdds">> = [
    ...(entries ?? []),
    ...(quickAdds ?? []),
  ];

  const totals: DailyTotals = allItems.reduce(
    (acc, item) => ({
      kcal: acc.kcal + item.kcal,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return {
    entries,
    quickAdds,
    entriesBySlot,
    quickAddsBySlot,
    totals,
    goals,
    isLoading: entries === undefined || quickAdds === undefined,
  };
}
