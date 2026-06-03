"use client";

import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { InputWithLoader } from "@strait/ui/components/input-with-loader";
import { Label } from "@strait/ui/components/label";
import { useState } from "react";

export default function InputWithLoaderWithEndIcon() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="loader-end">Search</Label>
      <InputWithLoader
        endIcon={value ? <HugeiconsIcon icon={Cancel01Icon} size={16} /> : null}
        endIconAriaLabel="Clear search"
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="loader-end"
        onChange={(e) => setValue(e.target.value)}
        onEndIconClick={() => setValue("")}
        placeholder="Search…"
        value={value}
      />
    </div>
  );
}
