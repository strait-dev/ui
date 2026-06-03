import { Skeleton } from "@strait/ui/components/skeleton";

export default function SkeletonCard() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading card"
      className="w-72 overflow-hidden rounded-lg border bg-card p-4"
      role="status"
    >
      <Skeleton className="mb-4 h-36 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}
