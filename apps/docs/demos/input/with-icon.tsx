import { Mail01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@strait/ui/components/input";
import { Label } from "@strait/ui/components/label";

export default function InputWithIcon() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="search-input">Search</Label>
        <div className="relative">
          <HugeiconsIcon
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            icon={Search01Icon}
          />
          <Input
            className="pl-8"
            id="search-input"
            placeholder="Search…"
            type="search"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email-input">Email</Label>
        <div className="relative">
          <HugeiconsIcon
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            icon={Mail01Icon}
          />
          <Input
            className="pl-8"
            id="email-input"
            placeholder="you@example.com"
            type="email"
          />
        </div>
      </div>
    </div>
  );
}
