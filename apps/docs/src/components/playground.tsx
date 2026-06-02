"use client";

import { Label } from "@strait/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@strait/ui/components/select";
import { Switch } from "@strait/ui/components/switch";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useMemo, useState } from "react";
import { getComponentDoc } from "@/src/lib/component-data";
import {
  type PlaygroundControls,
  type PlaygroundEntry,
  playgrounds,
} from "@/src/playground/config";

const DASH_RE = /-/g;
const FIRST_CHAR_RE = /^\w/;

/** Turns a prop/axis name (`brand-solid`, `size`) into a readable label. */
function toLabel(name: string): string {
  return name
    .replace(DASH_RE, " ")
    .replace(FIRST_CHAR_RE, (c) => c.toUpperCase());
}

/** Builds a faithful, copy-pasteable snippet from the current control values. */
function buildSnippet(
  entry: PlaygroundEntry,
  axes: string[],
  controls: PlaygroundControls
): string {
  if (entry.snippet) {
    return entry.snippet(controls);
  }

  const attrs: string[] = [];
  for (const axis of axes) {
    attrs.push(`${axis}="${controls[axis] as string}"`);
  }
  for (const bool of entry.booleans ?? []) {
    if (controls[bool]) {
      attrs.push(bool);
    }
  }
  if (entry.extraAttrs) {
    attrs.push(entry.extraAttrs);
  }

  const open = [entry.displayName, ...attrs].join(" ");
  return entry.childrenText
    ? `<${open}>${entry.childrenText}</${entry.displayName}>`
    : `<${open} />`;
}

/**
 * An interactive playground for single-element components: variant/size axes
 * become `Select`s, declared boolean props become `Switch`es, and the canvas
 * re-renders live alongside a generated snippet. Axes and their defaults are
 * read from the generated model; the per-component preview comes from
 * `playgrounds` config. Dogfoods the design system's own form controls.
 */
export function Playground({ name }: { name: string }) {
  const entry = playgrounds[name];
  const doc = getComponentDoc(name);

  const axes = doc ? Object.keys(doc.variants) : [];
  const booleans = entry?.booleans ?? [];

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    if (doc) {
      for (const axis of axes) {
        init[axis] = doc.defaultVariants[axis] ?? doc.variants[axis][0];
      }
    }
    return init;
  });
  const [bools, setBools] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(booleans.map((b) => [b, false]))
  );

  const controls = useMemo<PlaygroundControls>(
    () => ({ ...values, ...bools }),
    [values, bools]
  );
  const code = useMemo(
    () => (entry ? buildSnippet(entry, axes, controls) : ""),
    [entry, axes, controls]
  );

  if (!(entry && doc)) {
    return (
      <div className="rounded-lg border border-fd-border p-4 text-fd-muted-foreground text-sm">
        Playground for <code>{name}</code> is not configured.
      </div>
    );
  }

  return (
    <div className="not-prose my-4 flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-[1fr_240px]">
        <div className="flex min-h-56 w-full items-center justify-center rounded-lg border border-fd-border bg-fd-card p-8">
          {entry.render(controls)}
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-fd-border bg-fd-card p-4">
          {axes.map((axis) => (
            <div className="flex flex-col gap-1.5" key={axis}>
              <Label>{toLabel(axis)}</Label>
              <Select
                onValueChange={(v) =>
                  setValues((s) => ({ ...s, [axis]: v ?? s[axis] }))
                }
                value={values[axis]}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {doc.variants[axis].map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          {booleans.map((bool) => (
            <div className="flex items-center justify-between gap-2" key={bool}>
              <Label htmlFor={`pg-${name}-${bool}`}>{toLabel(bool)}</Label>
              <Switch
                checked={bools[bool]}
                id={`pg-${name}-${bool}`}
                onCheckedChange={(c) => setBools((s) => ({ ...s, [bool]: c }))}
              />
            </div>
          ))}
        </div>
      </div>

      <DynamicCodeBlock code={code} lang="tsx" />
    </div>
  );
}
