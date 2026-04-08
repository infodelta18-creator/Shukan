import { useState, useRef } from "react";
import { Trash2 } from "lucide-react";

export default function SwipeableRow({
  children,
  onDelete,
}: {
  children: React.ReactNode;
  onDelete: () => void;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.touches[0].clientX - startXRef.current;
    if (diff < 0) {
      setOffsetX(Math.max(diff, -80));
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    if (offsetX < -50) {
      setOffsetX(-80);
    } else {
      setOffsetX(0);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-y-0 right-0 flex items-center bg-destructive px-4"
        style={{ width: 80 }}
      >
        <button onClick={onDelete} className="w-full flex justify-center">
          <Trash2 className="h-5 w-5 text-destructive-foreground" />
        </button>
      </div>
      <div
        className="relative bg-background transition-transform"
        style={{ transform: `translateX(${offsetX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
