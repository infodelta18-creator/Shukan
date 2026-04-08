import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import type { Doc } from "../../../convex/_generated/dataModel";
import { MEAL_SLOT_LABELS } from "@/hooks/useDailyLog";
import type { MealSlot } from "@/hooks/useDailyLog";
import MealEntryRow from "./MealEntryRow";

export default function MealSlotSection({
  date,
  slot,
  entries,
  quickAdds,
}: {
  date: string;
  slot: MealSlot;
  entries: Doc<"mealEntries">[];
  quickAdds: Doc<"quickAdds">[];
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  const allItems = [...entries, ...quickAdds];
  const slotKcal = allItems.reduce((sum, item) => sum + item.kcal, 0);

  return (
    <div className="border-b">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className="font-medium">{MEAL_SLOT_LABELS[slot]}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {slotKcal > 0 ? `${slotKcal} kcal` : ""}
        </span>
      </button>

      {expanded && (
        <div>
          {allItems.map((item) => (
            <MealEntryRow key={item._id} entry={item} />
          ))}
          <div className="flex gap-2 px-4 py-2">
            <button
              onClick={() => navigate(`/log/${date}/${slot}`)}
              className="flex items-center gap-1 text-sm text-primary"
            >
              <Plus className="h-4 w-4" />
              Add Food
            </button>
            <button
              onClick={() => navigate(`/log/${date}/${slot}/quick`)}
              className="text-sm text-muted-foreground"
            >
              Quick Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
