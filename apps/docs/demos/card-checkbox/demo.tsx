"use client";

import {
  ComputerIcon,
  SmartPhone01Icon,
  Tablet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CardCheckboxGroup,
  CardCheckboxItem,
} from "@strait/ui/components/card-checkbox";
import { useState } from "react";

export default function CardCheckboxDemo() {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    desktop: true,
    mobile: false,
    tablet: false,
  });

  return (
    <div className="w-80">
      <CardCheckboxGroup>
        <CardCheckboxItem
          checked={checked.desktop}
          description="Optimised for large screens"
          icon={<HugeiconsIcon className="size-5" icon={ComputerIcon} />}
          id="device-desktop"
          label="Desktop"
          layout="start"
          onCheckedChange={(v) =>
            setChecked((p) => ({ ...p, desktop: Boolean(v) }))
          }
        />
        <CardCheckboxItem
          checked={checked.mobile}
          description="Optimised for small screens"
          icon={<HugeiconsIcon className="size-5" icon={SmartPhone01Icon} />}
          id="device-mobile"
          label="Mobile"
          layout="start"
          onCheckedChange={(v) =>
            setChecked((p) => ({ ...p, mobile: Boolean(v) }))
          }
        />
        <CardCheckboxItem
          checked={checked.tablet}
          description="Optimised for medium screens"
          icon={<HugeiconsIcon className="size-5" icon={Tablet01Icon} />}
          id="device-tablet"
          label="Tablet"
          layout="start"
          onCheckedChange={(v) =>
            setChecked((p) => ({ ...p, tablet: Boolean(v) }))
          }
        />
      </CardCheckboxGroup>
    </div>
  );
}
