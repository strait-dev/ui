import { StatusBadge } from "@strait/ui/components/status-badge";

const statuses = [
  "queued",
  "running",
  "completed",
  "failed",
  "timed_out",
  "delayed",
  "paused",
  "canceled",
  "retrying",
  "scheduled",
];

export default function StatusBadgeAllStatusesDemo() {
  return (
    <div className="flex max-w-md flex-wrap gap-2">
      {statuses.map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  );
}
