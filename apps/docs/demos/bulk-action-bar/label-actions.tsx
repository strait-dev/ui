"use client";

import { BulkActionBar } from "@strait/ui/components/bulk-action-bar";
import { useState } from "react";

export default function BulkActionBarLabelActions() {
  const [count, setCount] = useState(3);

  return (
    <BulkActionBar
      actions={[
        { label: "Export", onClick: () => undefined },
        { label: "Assign", onClick: () => undefined },
        {
          label: "Delete",
          variant: "destructive",
          onClick: () => undefined,
        },
      ]}
      onClearSelection={() => setCount(0)}
      selectedCount={count}
    />
  );
}
