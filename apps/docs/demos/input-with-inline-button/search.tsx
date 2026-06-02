"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import { InputWithInlineButton } from "@strait/ui/components/input-with-inline-button";
import { Label } from "@strait/ui/components/label";
import { useState } from "react";

export default function InputWithInlineButtonSearch() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inline-btn-search">Search</Label>
      <InputWithInlineButton
        button={
          <Button
            aria-label="Search"
            className="rounded-s-none"
            onClick={() => setQuery("")}
            type="button"
            variant="default"
          >
            <HugeiconsIcon icon={Search01Icon} size={16} />
          </Button>
        }
        id="inline-btn-search"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        value={query}
      />
    </div>
  );
}
