import { Skeleton } from "@strait/ui/components/skeleton";

function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 py-2">
      <Skeleton className="size-8 shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <Skeleton className="h-5 w-12 rounded-lg" />
    </div>
  );
}

export default function SkeletonList() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading list"
      className="w-80 divide-y rounded-lg border bg-card px-3"
      role="status"
    >
      <ListItemSkeleton />
      <ListItemSkeleton />
      <ListItemSkeleton />
      <ListItemSkeleton />
      <ListItemSkeleton />
    </div>
  );
}
