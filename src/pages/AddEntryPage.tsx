import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import type { MealSlot } from "@/hooks/useDailyLog";
import { ArrowLeft } from "lucide-react";
import { MEAL_SLOT_LABELS } from "@/hooks/useDailyLog";
import FoodList from "@/components/foods/FoodList";
import { Input } from "@/components/ui/input";
import ServingsInput from "@/components/today/ServingsInput";

export default function AddEntryPage() {
  const navigate = useNavigate();
  const { date, mealSlot } = useParams<{ date: string; mealSlot: string }>();
  const slot = mealSlot as MealSlot;

  const addEntry = useMutation(api.mealEntries.add);
  const markUsed = useMutation(api.foods.markUsed);

  const [selectedFood, setSelectedFood] = useState<Doc<"foods"> | null>(null);
  const [search, setSearch] = useState("");

  const handleConfirm = async (servings: number) => {
    if (!selectedFood || !date) return;
    await addEntry({
      date,
      mealSlot: slot,
      foodId: selectedFood._id,
      servings,
    });
    await markUsed({ id: selectedFood._id });
    navigate(-1);
  };

  if (selectedFood) {
    return (
      <ServingsInput
        food={selectedFood}
        onConfirm={handleConfirm}
        onCancel={() => setSelectedFood(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold">
            Add to {MEAL_SLOT_LABELS[slot]}
          </h1>
        </div>
        <Input
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <FoodList
          searchQuery={search || undefined}
          filter={search ? undefined : "recent"}
          onSelect={setSelectedFood}
        />
      </div>
    </div>
  );
}
