"use client";

import {
  Archive02Icon,
  Delete01Icon,
  Download02Icon,
  Edit01Icon,
} from "@hugeicons/core-free-icons";
import { BulkActionBar } from "@strait/ui/components/bulk-action-bar";
import { useState } from "react";

export default function BulkActionBarIconActions() {
  const [count, setCount] = useState(5);

  return (
    <div className="flex flex-col items-center gap-4">
      <BulkActionBar
        actions={[
          { label: "Edit", icon: Edit01Icon, onClick: () => undefined },
          { label: "Archive", icon: Archive02Icon, onClick: () => undefined },
          { label: "Download", icon: Download02Icon, onClick: () => undefined },
          {
            label: "Delete",
            icon: Delete01Icon,
            variant: "destructive",
            onClick: () => undefined,
          },
        ]}
        onClearSelection={() => setCount(0)}
        selectedCount={count}
      />
    </div>
  );
}
