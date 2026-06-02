"use client";

import {
  DirectionProvider,
  useDirection,
} from "@strait/ui/components/direction";

function DirectionDisplay() {
  const dir = useDirection();
  return (
    <div
      className="flex items-center gap-2 rounded-md border bg-muted/40 px-4 py-3 text-sm"
      dir={dir}
    >
      <span className="text-muted-foreground">Current direction:</span>
      <span className="font-mono font-semibold">{dir}</span>
    </div>
  );
}

export default function DirectionDemo() {
  return (
    <div className="w-72 space-y-3">
      <p className="text-muted-foreground text-xs">
        No provider (defaults to ltr)
      </p>
      <DirectionDisplay />
      <p className="text-muted-foreground text-xs">
        Wrapped in DirectionProvider direction="rtl"
      </p>
      <DirectionProvider direction="rtl">
        <DirectionDisplay />
      </DirectionProvider>
    </div>
  );
}
