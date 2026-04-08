import { useState } from "react";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ServingsInput({
  food,
  onConfirm,
  onCancel,
}: {
  food: Doc<"foods">;
  onConfirm: (servings: number) => void;
  onCancel: () => void;
}) {
  const [servings, setServings] = useState(food.defaultServingSize);
  const kcal = Math.round(food.kcal * servings);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold">{food.name}</h3>
        {food.brand && (
          <p className="text-sm text-muted-foreground">{food.brand}</p>
        )}
      </div>

      <div className="rounded-lg bg-muted p-3 text-center">
        <span className="text-2xl font-bold">{kcal}</span>
        <span className="text-muted-foreground"> kcal</span>
        <div className="mt-1 text-sm text-muted-foreground">
          P: {Math.round(food.protein * servings * 10) / 10}g &middot; C:{" "}
          {Math.round(food.carbs * servings * 10) / 10}g &middot; F:{" "}
          {Math.round(food.fat * servings * 10) / 10}g
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Servings</label>
        <Input
          type="number"
          min={0.25}
          step={0.25}
          value={servings}
          onChange={(e) => setServings(Number(e.target.value) || 0)}
          className="w-24"
        />
        <span className="text-sm text-muted-foreground">{food.servingUnit}</span>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={() => onConfirm(servings)}>
          Add
        </Button>
      </div>
    </div>
  );
}
