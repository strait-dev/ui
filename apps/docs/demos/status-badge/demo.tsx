import { StatusBadge } from "@strait/ui/components/status-badge";

const statuses = [
  "running",
  "completed",
  "failed",
  "pending",
  "delayed",
  "paused",
  "canceled",
  "scheduled",
];

export default function StatusBadgeDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  );
}
