import { Separator } from "@strait/ui/components/separator";

export default function SeparatorHorizontalVertical() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-80 flex-col gap-3">
        <p className="font-medium text-muted-foreground text-xs">
          Horizontal (default)
        </p>
        <div>
          <p className="font-medium text-sm">Profile</p>
          <p className="text-muted-foreground text-xs">Manage your account</p>
        </div>
        <Separator />
        <div>
          <p className="font-medium text-sm">Billing</p>
          <p className="text-muted-foreground text-xs">
            View invoices and plans
          </p>
        </div>
      </div>

      <div>
        <p className="mb-3 font-medium text-muted-foreground text-xs">
          Vertical
        </p>
        <div className="flex h-8 items-center gap-3">
          <span className="text-sm">Home</span>
          <Separator orientation="vertical" />
          <span className="text-sm">Projects</span>
          <Separator orientation="vertical" />
          <span className="text-sm">Settings</span>
        </div>
      </div>
    </div>
  );
}
