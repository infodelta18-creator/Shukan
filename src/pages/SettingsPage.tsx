import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { signOut } = useAuthActions();
  const goals = useQuery(api.userGoals.get);
  const upsertGoals = useMutation(api.userGoals.upsert);

  const [form, setForm] = useState({
    dailyKcal: 2000,
    dailyProtein: 150,
    dailyCarbs: 250,
    dailyFat: 65,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (goals) {
      setForm({
        dailyKcal: goals.dailyKcal,
        dailyProtein: goals.dailyProtein,
        dailyCarbs: goals.dailyCarbs,
        dailyFat: goals.dailyFat,
      });
    }
  }, [goals]);

  const handleSave = async () => {
    await upsertGoals(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: Number(value) || 0 }));
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Settings</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Daily Goals</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="kcal">Calories (kcal)</Label>
            <Input
              id="kcal"
              type="number"
              value={form.dailyKcal}
              onChange={(e) => updateField("dailyKcal", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              type="number"
              value={form.dailyProtein}
              onChange={(e) => updateField("dailyProtein", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input
              id="carbs"
              type="number"
              value={form.dailyCarbs}
              onChange={(e) => updateField("dailyCarbs", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="fat">Fat (g)</Label>
            <Input
              id="fat"
              type="number"
              value={form.dailyFat}
              onChange={(e) => updateField("dailyFat", e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleSave}>
          {saved ? "Saved!" : "Save Goals"}
        </Button>
      </section>

      <section className="pt-4 border-t">
        <Button variant="outline" onClick={() => void signOut()}>
          Sign out
        </Button>
      </section>
    </div>
  );
}
