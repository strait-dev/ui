"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { InputWithLoader } from "@strait/ui/components/input-with-loader";
import { Label } from "@strait/ui/components/label";
import { useState } from "react";

export default function InputWithLoaderLoadingState() {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setLoading(e.target.value.length > 0);
  };

  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="loader-async">Search</Label>
      <InputWithLoader
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="loader-async"
        loading={loading}
        onChange={handleChange}
        placeholder="Type to trigger loader…"
        value={value}
      />
    </div>
  );
}
