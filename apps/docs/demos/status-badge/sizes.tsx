import { StatusBadge } from "@strait/ui/components/status-badge";

export default function StatusBadgeSizesDemo() {
  return (
    <div className="flex items-center gap-2">
      <StatusBadge size="xs" status="running" />
      <StatusBadge size="sm" status="running" />
      <StatusBadge size="default" status="running" />
      <StatusBadge size="lg" status="running" />
      <StatusBadge size="xl" status="running" />
    </div>
  );
}
