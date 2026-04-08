import type { Doc } from "../../../convex/_generated/dataModel";

export default function MealEntryRow({
  entry,
}: {
  entry: Doc<"mealEntries"> | Doc<"quickAdds">;
}) {
  const isQuickAdd = !("foodName" in entry);

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {isQuickAdd
            ? (entry as Doc<"quickAdds">).note || "Quick Add"
            : (entry as Doc<"mealEntries">).foodName}
        </p>
        {!isQuickAdd && (
          <p className="text-xs text-muted-foreground">
            {(entry as Doc<"mealEntries">).servings} serving
            {(entry as Doc<"mealEntries">).servings !== 1 ? "s" : ""}
          </p>
        )}
      </div>
      <div className="text-right text-sm">
        <span className="font-medium">{entry.kcal}</span>
        <span className="text-muted-foreground"> kcal</span>
      </div>
    </div>
  );
}
