import { StatusBadge } from "@strait/ui/components/status-badge";

export default function StatusBadgeWithPulseDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge pulse status="running" />
      <StatusBadge pulse status="executing" />
      <StatusBadge pulse status="active" />
      <StatusBadge pulse status="retrying" />
    </div>
  );
}
