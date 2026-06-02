"use client";

import {
  DirectionProvider,
  useDirection,
} from "@strait/ui/components/direction";

function DirectionBadge() {
  const dir = useDirection();
  return (
    <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm" dir={dir}>
      <span className="text-muted-foreground">Direction: </span>
      <span className="font-mono font-semibold">{dir}</span>
    </div>
  );
}

export default function DirectionRtlText() {
  return (
    <div className="w-72 space-y-3">
      <p className="text-muted-foreground text-xs">LTR (default)</p>
      <DirectionProvider direction="ltr">
        <DirectionBadge />
      </DirectionProvider>
      <p className="text-muted-foreground text-xs">RTL</p>
      <DirectionProvider direction="rtl">
        <DirectionBadge />
      </DirectionProvider>
    </div>
  );
}
