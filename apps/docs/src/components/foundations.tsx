import {
  Album02Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Download04Icon,
  Folder01Icon,
  Home09Icon,
  Mail01Icon,
  Notification03Icon,
  Search01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { CSSProperties } from "react";
import tokens from "@/.generated/tokens.json";

/** Live swatches for every semantic color token, grouped by role. */
export function ColorSwatches() {
  return (
    <div className="flex flex-col gap-8">
      {Object.entries(tokens.colors).map(([group, names]) => (
        <section className="flex flex-col gap-3" key={group}>
          <h3 className="font-medium text-sm">{group}</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {names.map((name) => (
              <div className="flex items-center gap-3" key={name}>
                <div
                  className="size-10 shrink-0 rounded-lg border border-fd-border"
                  style={{ backgroundColor: `var(--${name})` }}
                />
                <code className="text-fd-muted-foreground text-xs">
                  --{name}
                </code>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** The semantic type scale, rendered at its real size/weight. */
export function TypeScale() {
  return (
    <div className="flex flex-col">
      {tokens.typeScale.map((t) => (
        <div
          className="flex items-baseline justify-between gap-4 border-fd-border border-b py-4"
          key={t.name}
        >
          <span
            className="truncate text-foreground"
            style={
              {
                fontSize: `var(--text-${t.name})`,
                lineHeight: t.lineHeight,
                fontWeight: t.weight,
              } as CSSProperties
            }
          >
            The quick brown fox
          </span>
          <code className="shrink-0 text-fd-muted-foreground text-xs">
            text-{t.name} · {t.size}
          </code>
        </div>
      ))}
    </div>
  );
}

/** The radius scale. */
export function RadiusScale() {
  return (
    <div className="flex flex-wrap gap-6">
      {tokens.radii.map((r) => (
        <div className="flex flex-col items-center gap-2" key={r.name}>
          <div
            className="size-16 border border-primary/30 bg-primary/10"
            style={{ borderRadius: `var(--radius-${r.name})` }}
          />
          <code className="text-fd-muted-foreground text-xs">
            rounded-{r.name}
          </code>
        </div>
      ))}
    </div>
  );
}

const SHADOWS = [
  "shadow-2xs",
  "shadow-xs",
  "shadow-sm",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
];

/** The elevation (shadow) scale. */
export function ShadowScale() {
  return (
    <div className="flex flex-wrap gap-6">
      {SHADOWS.map((s) => (
        <div className="flex flex-col items-center gap-2" key={s}>
          <div className={`size-16 rounded-lg bg-card ${s}`} />
          <code className="text-fd-muted-foreground text-xs">{s}</code>
        </div>
      ))}
    </div>
  );
}

const SPACING = [1, 2, 3, 4, 6, 8, 12, 16, 24];

/** A sample of the spacing scale (base unit 0.25rem). */
export function SpacingScale() {
  return (
    <div className="flex flex-col gap-2">
      {SPACING.map((n) => (
        <div className="flex items-center gap-3" key={n}>
          <code className="w-12 shrink-0 text-fd-muted-foreground text-xs">
            {n}
          </code>
          <div
            className="h-4 rounded-sm bg-primary/20"
            style={{ width: `calc(var(--spacing) * ${n})` }}
          />
        </div>
      ))}
    </div>
  );
}

const SAMPLE_ICONS = [
  { name: "Home09Icon", icon: Home09Icon },
  { name: "Search01Icon", icon: Search01Icon },
  { name: "Settings01Icon", icon: Settings01Icon },
  { name: "Notification03Icon", icon: Notification03Icon },
  { name: "Mail01Icon", icon: Mail01Icon },
  { name: "Calendar03Icon", icon: Calendar03Icon },
  { name: "Folder01Icon", icon: Folder01Icon },
  { name: "Download04Icon", icon: Download04Icon },
  { name: "CheckmarkCircle02Icon", icon: CheckmarkCircle02Icon },
  { name: "Album02Icon", icon: Album02Icon },
];

/** A representative sample of the Hugeicons set used across the system. */
export function IconGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {SAMPLE_ICONS.map(({ name, icon }) => (
        <div
          className="flex flex-col items-center gap-2 rounded-lg border border-fd-border p-4"
          key={name}
        >
          <HugeiconsIcon className="text-foreground" icon={icon} />
          <code className="truncate text-[10px] text-fd-muted-foreground">
            {name}
          </code>
        </div>
      ))}
    </div>
  );
}
