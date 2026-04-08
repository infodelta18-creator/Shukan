import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type FoodFormData = {
  name: string;
  brand: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  defaultServingSize: number;
  servingUnit: string;
  barcode: string;
};

export default function FoodForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Partial<FoodFormData>;
  onSubmit: (data: FoodFormData) => void;
  submitLabel: string;
}) {
  const [form, setForm] = useState<FoodFormData>({
    name: initial?.name ?? "",
    brand: initial?.brand ?? "",
    kcal: initial?.kcal ?? 0,
    protein: initial?.protein ?? 0,
    carbs: initial?.carbs ?? 0,
    fat: initial?.fat ?? 0,
    defaultServingSize: initial?.defaultServingSize ?? 1,
    servingUnit: initial?.servingUnit ?? "serving",
    barcode: initial?.barcode ?? "",
  });

  const update = (field: keyof FoodFormData, value: string) => {
    if (
      field === "name" ||
      field === "brand" ||
      field === "servingUnit" ||
      field === "barcode"
    ) {
      setForm((prev) => ({ ...prev, [field]: value }));
    } else {
      setForm((prev) => ({ ...prev, [field]: Number(value) || 0 }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={form.brand}
          onChange={(e) => update("brand", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="kcal">Calories (kcal)</Label>
          <Input
            id="kcal"
            type="number"
            value={form.kcal}
            onChange={(e) => update("kcal", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="protein">Protein (g)</Label>
          <Input
            id="protein"
            type="number"
            value={form.protein}
            onChange={(e) => update("protein", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="carbs">Carbs (g)</Label>
          <Input
            id="carbs"
            type="number"
            value={form.carbs}
            onChange={(e) => update("carbs", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fat">Fat (g)</Label>
          <Input
            id="fat"
            type="number"
            value={form.fat}
            onChange={(e) => update("fat", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="servingSize">Serving Size</Label>
          <Input
            id="servingSize"
            type="number"
            value={form.defaultServingSize}
            onChange={(e) => update("defaultServingSize", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="servingUnit">Serving Unit</Label>
          <Input
            id="servingUnit"
            value={form.servingUnit}
            onChange={(e) => update("servingUnit", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="barcode">Barcode</Label>
        <Input
          id="barcode"
          value={form.barcode}
          onChange={(e) => update("barcode", e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
