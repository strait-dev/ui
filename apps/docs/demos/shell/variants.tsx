import { Shell } from "@strait/ui/components/shell";

export default function ShellVariants() {
  return (
    <div className="flex w-full flex-col gap-6">
      {(["default", "centered", "fluid"] as const).map((variant) => (
        <div key={variant}>
          <p className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            {variant}
          </p>
          <div className="rounded-lg border">
            <Shell variant={variant}>
              <div className="rounded-md bg-muted/50 p-4 text-center text-muted-foreground text-sm">
                variant="{variant}"
              </div>
              <div className="rounded-md bg-muted/50 p-4 text-center text-muted-foreground text-sm">
                Second section
              </div>
            </Shell>
          </div>
        </div>
      ))}
    </div>
  );
}
