import { RadialGauge } from "@strait/ui/components/radial-gauge";

export default function RadialGaugeCustomColorDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="size-36">
          <RadialGauge color="var(--chart-2)" label="Completion" value={82} />
        </div>
        <span className="text-muted-foreground text-xs">Explicit color</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="size-36">
          <RadialGauge label="Requests/s" max={200} value={140} />
        </div>
        <span className="text-muted-foreground text-xs">Custom max (200)</span>
      </div>
    </div>
  );
}
