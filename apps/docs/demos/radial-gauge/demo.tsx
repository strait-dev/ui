import { RadialGauge } from "@strait/ui/components/radial-gauge";

export default function RadialGaugeDemo() {
  return (
    <div className="flex items-center gap-8">
      <div className="size-40">
        <RadialGauge label="CPU Usage" value={42} />
      </div>
      <div className="size-40">
        <RadialGauge label="Memory" value={78} />
      </div>
      <div className="size-40">
        <RadialGauge label="Disk I/O" value={93} />
      </div>
    </div>
  );
}
