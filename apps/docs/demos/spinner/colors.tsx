import { Spinner } from "@strait/ui/components/spinner";

export default function SpinnerColors() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {(
        [
          { label: "default", cls: "text-foreground" },
          { label: "muted", cls: "text-muted-foreground" },
          { label: "success", cls: "text-success" },
          { label: "warning", cls: "text-warning" },
          { label: "destructive", cls: "text-destructive" },
        ] as const
      ).map(({ label, cls }) => (
        <div className="flex flex-col items-center gap-2" key={label}>
          <Spinner className={cls} size="lg" />
          <span className="text-muted-foreground text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}
