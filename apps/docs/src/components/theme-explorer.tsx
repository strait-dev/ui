"use client";

import { Button } from "@strait/ui/components/button";
import type { CSSProperties } from "react";
import { useState } from "react";

const PRESETS = ["#f5533d", "#6366f1", "#16a34a", "#d97706", "#0ea5e9"];

/**
 * Interactive demonstration of the single-token rebrand: setting `--brand` on a
 * scoped preview root re-themes the whole brand triad, and toggling `.dark` on
 * the same root flips the preview between light and dark — exactly how a
 * consuming app themes Strait.
 */
export function ThemeExplorer() {
  const [brand, setBrand] = useState(PRESETS[0]);
  const [dark, setDark] = useState(false);

  return (
    <div className="my-4 flex flex-col gap-4 rounded-lg border border-fd-border p-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-fd-muted-foreground">Brand</span>
          <input
            aria-label="Brand colour"
            className="size-8 cursor-pointer rounded-md border border-fd-border bg-transparent"
            onChange={(e) => setBrand(e.target.value)}
            type="color"
            value={brand}
          />
        </label>
        <div className="flex gap-1.5">
          {PRESETS.map((preset) => (
            <button
              aria-label={`Use ${preset}`}
              className="size-6 rounded-full border border-fd-border"
              key={preset}
              onClick={() => setBrand(preset)}
              style={{ backgroundColor: preset }}
              type="button"
            />
          ))}
        </div>
        <Button
          className="ml-auto"
          onClick={() => setDark((d) => !d)}
          size="sm"
          variant="outline"
        >
          {dark ? "Light preview" : "Dark preview"}
        </Button>
      </div>

      <div
        className={`flex flex-wrap items-center gap-3 rounded-lg bg-background p-6 ${dark ? "dark" : ""}`}
        style={{ "--brand": brand } as CSSProperties}
      >
        <Button variant="brand-solid">Brand solid</Button>
        <Button variant="brand">Brand soft</Button>
        <Button variant="brand-outline">Brand outline</Button>
        <Button variant="default">Default</Button>
      </div>
    </div>
  );
}
