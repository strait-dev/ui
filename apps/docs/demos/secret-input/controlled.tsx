"use client";

import { Label } from "@strait/ui/components/label";
import { SecretInput } from "@strait/ui/components/secret-input";
import { useState } from "react";

export default function SecretInputControlled() {
  const [value, setValue] = useState("sk_live_51H8xBcDeFgH");

  return (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="api-key">API key</Label>
      <SecretInput
        id="api-key"
        onChange={(e) => setValue(e.target.value)}
        placeholder="sk_live_…"
        value={value}
      />
    </div>
  );
}
