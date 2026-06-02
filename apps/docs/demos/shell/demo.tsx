import { Separator } from "@strait/ui/components/separator";
import { Shell } from "@strait/ui/components/shell";

export default function ShellDemo() {
  return (
    <div className="rounded-lg border">
      <Shell variant="default">
        <div>
          <h1 className="font-semibold text-lg">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Welcome back. Here is what is happening today.
          </p>
        </div>
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Users", value: "1,240" },
            { label: "Projects", value: "38" },
            { label: "Issues", value: "12" },
          ].map((stat) => (
            <div
              className="rounded-lg border bg-muted/40 p-4 text-center"
              key={stat.label}
            >
              <p className="font-bold text-xl">{stat.value}</p>
              <p className="text-muted-foreground text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </Shell>
    </div>
  );
}
