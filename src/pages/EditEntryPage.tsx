import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EditEntryPage() {
  const navigate = useNavigate();
  const { entryId } = useParams<{ entryId: string }>();

  const entry = useQuery(
    api.mealEntries.getById,
    entryId ? { id: entryId as Id<"mealEntries"> } : "skip",
  );
  const updateEntry = useMutation(api.mealEntries.update);

  const [servings, setServings] = useState(1);

  useEffect(() => {
    if (entry) {
      setServings(entry.servings);
    }
  }, [entry]);

  const handleSubmit = async () => {
    if (!entryId) return;
    await updateEntry({
      id: entryId as Id<"mealEntries">,
      servings,
    });
    navigate(-1);
  };

  if (entry === undefined) {
    return (
      <div className="p-4 text-center text-muted-foreground">Loading...</div>
    );
  }

  if (entry === null) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Entry not found
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">Edit Entry</h1>
      </div>

      <div>
        <h3 className="font-medium">{entry.foodName}</h3>
        <p className="text-sm text-muted-foreground">
          {entry.kcal} kcal for {entry.servings} serving
          {entry.servings !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-1">
        <Label>Servings</Label>
        <Input
          type="number"
          min={0.25}
          step={0.25}
          value={servings}
          onChange={(e) => setServings(Number(e.target.value) || 0)}
        />
      </div>

      <Button className="w-full" onClick={handleSubmit}>
        Update
      </Button>
    </div>
  );
}
