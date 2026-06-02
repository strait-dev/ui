import { Separator } from "@strait/ui/components/separator";

export default function SeparatorDemo() {
  return (
    <div className="w-80 space-y-3">
      <div>
        <p className="font-medium text-sm">Profile</p>
        <p className="text-muted-foreground text-xs">Manage your account</p>
      </div>
      <Separator />
      <div>
        <p className="font-medium text-sm">Billing</p>
        <p className="text-muted-foreground text-xs">View invoices and plans</p>
      </div>
      <Separator />
      <div>
        <p className="font-medium text-sm">Security</p>
        <p className="text-muted-foreground text-xs">
          Two-factor authentication
        </p>
      </div>
    </div>
  );
}
