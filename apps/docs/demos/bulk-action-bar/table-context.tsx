"use client";

import { Archive02Icon, Delete01Icon } from "@hugeicons/core-free-icons";
import { BulkActionBar } from "@strait/ui/components/bulk-action-bar";
import { useState } from "react";

const rows = [
  { id: 1, name: "Alpha", status: "Active" },
  { id: 2, name: "Beta", status: "Paused" },
  { id: 3, name: "Gamma", status: "Active" },
  { id: 4, name: "Delta", status: "Archived" },
];

export default function BulkActionBarTableContext() {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="py-2 pr-3 font-medium" />
            <th className="py-2 pr-3 font-medium">Name</th>
            <th className="py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="border-b" key={row.id}>
              <td className="py-2 pr-3">
                <input
                  aria-label={`Select ${row.name}`}
                  checked={selected.includes(row.id)}
                  onChange={() => toggle(row.id)}
                  type="checkbox"
                />
              </td>
              <td className="py-2 pr-3">{row.name}</td>
              <td className="py-2 text-muted-foreground">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected.length > 0 && (
        <BulkActionBar
          actions={[
            { label: "Archive", icon: Archive02Icon, onClick: () => undefined },
            {
              label: "Delete",
              icon: Delete01Icon,
              variant: "destructive",
              onClick: () => undefined,
            },
          ]}
          onClearSelection={() => setSelected([])}
          position="static"
          selectedCount={selected.length}
        />
      )}
    </div>
  );
}
