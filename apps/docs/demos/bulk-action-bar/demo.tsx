"use client";

import { Archive02Icon, Delete01Icon } from "@hugeicons/core-free-icons";
import { BulkActionBar } from "@strait/ui/components/bulk-action-bar";
import { useState } from "react";

const rows = [
  { id: 1, name: "Design System" },
  { id: 2, name: "Marketing Site" },
  { id: 3, name: "Mobile App" },
  { id: 4, name: "Analytics Pipeline" },
];

export default function BulkActionBarDemo() {
  const [selected, setSelected] = useState<number[]>([1, 3]);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex w-80 flex-col gap-3">
      <table className="w-full text-sm">
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
              <td className="py-2">{row.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected.length > 0 && (
        <BulkActionBar
          actions={[
            {
              label: "Archive",
              icon: Archive02Icon,
              onClick: () => setSelected([]),
            },
            {
              label: "Delete",
              icon: Delete01Icon,
              variant: "destructive",
              onClick: () => setSelected([]),
            },
          ]}
          onClearSelection={() => setSelected([])}
          selectedCount={selected.length}
        />
      )}
    </div>
  );
}
