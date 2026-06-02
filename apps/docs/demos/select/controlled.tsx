"use client";

import { Label } from "@strait/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@strait/ui/components/select";
import { useState } from "react";

export default function SelectControlled() {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="priority-select">Priority</Label>
        <Select onValueChange={(v) => setValue(v ?? "")} value={value}>
          <SelectTrigger className="w-48" id="priority-select">
            <SelectValue placeholder="Set priority…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-muted-foreground text-sm">
        Selected: <code>{value || "none"}</code>
      </p>
    </div>
  );
}
