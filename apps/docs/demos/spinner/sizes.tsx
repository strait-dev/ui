import { Spinner } from "@strait/ui/components/spinner";

export default function SpinnerSizes() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {(["xs", "sm", "default", "lg", "xl"] as const).map((size) => (
        <div className="flex flex-col items-center gap-2" key={size}>
          <Spinner size={size} />
          <span className="text-muted-foreground text-xs">{size}</span>
        </div>
      ))}
    </div>
  );
}
