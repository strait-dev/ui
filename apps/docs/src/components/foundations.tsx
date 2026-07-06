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

const SHADOW_NOTES: Record<string, string> = {
  sm: "cards at rest",
  md: "floating surfaces",
  lg: "hover-lift, modals",
};

/** The tokenized elevation scale (light and dark values live in the CSS). */
export function ShadowScale() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {tokens.shadows.map((s) => (
        <div className="flex flex-col gap-2" key={s.name}>
          <div
            className="h-24 rounded-lg bg-card ring-1 ring-foreground/10"
            style={{ boxShadow: `var(--shadow-${s.name})` }}
          />
          <code className="text-fd-muted-foreground text-xs">
            shadow-{s.name}
          </code>
          <span className="text-fd-muted-foreground text-xs">
            {SHADOW_NOTES[s.name]}
          </span>
        </div>
      ))}
    </div>
  );
}

const DURATION_NOTES: Record<string, string> = {
  instant: "color & opacity feedback — hover fills, active states",
  fast: "focus rings, toggles, switches, tooltips",
  base: "popovers, dropdowns, accordions, hover-lift",
  slow: "dialogs, sheets, drawers, list-item entrances",
  deliberate: "scroll reveals, staggered sections, page transitions",
};

const EASING_NOTES: Record<string, string> = {
  out: "everything entering",
  in: "everything exiting",
  "in-out": "moves & resizes within the screen",
};

/**
 * The motion duration ladder and easing curves. Hover a row to see its
 * duration and the ease-out curve applied to a real transform.
 */
export function MotionScale() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        {tokens.durations.map((d) => (
          <div
            className="group flex items-center gap-4 border-fd-border border-b py-3"
            key={d.name}
          >
            <div className="w-44 shrink-0">
              <code className="text-xs">duration-(--duration-{d.name})</code>
              <div className="text-fd-muted-foreground text-xs">
                {d.value} · {DURATION_NOTES[d.name]}
              </div>
            </div>
            <div
              className="relative h-4 flex-1 overflow-hidden rounded-sm bg-primary/10"
              style={{ containerType: "size" }}
            >
              <div
                className="h-full w-4 rounded-sm bg-primary/60 transition-transform group-hover:translate-x-[calc(100cqw-1rem)]"
                style={{
                  transitionDuration: `var(--duration-${d.name})`,
                  transitionTimingFunction: "var(--ease-out)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tokens.easings.map((e) => (
          <div
            className="flex flex-col gap-1 rounded-lg border border-fd-border p-4"
            key={e.name}
          >
            <code className="text-xs">ease-{e.name}</code>
            <span className="text-fd-muted-foreground text-xs">{e.value}</span>
            <span className="text-fd-muted-foreground text-xs">
              {EASING_NOTES[e.name]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const LAYER_NOTES: Record<string, string> = {
  base: "page content",
  sticky: "sticky headers, bulk-action bar",
  overlay: "the modal scrim",
  modal: "dialogs, sheets, drawers",
  popover: "popovers, dropdowns, command",
  toast: "sonner toasts, banners",
  tooltip: "tooltips — always on top",
};

/** The z-index layer ladder, rendered as a stack from content to tooltip. */
export function LayerStack() {
  const layers = [...tokens.layers].reverse();
  return (
    <div className="flex flex-col gap-2">
      {layers.map((l, i) => (
        <div
          className="flex items-center gap-4 rounded-lg border border-fd-border bg-card px-4 py-2"
          key={l.name}
          style={{
            marginLeft: `${(layers.length - 1 - i) * 1.25}rem`,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <code className="w-36 shrink-0 text-xs">z-(--z-{l.name})</code>
          <span className="w-10 shrink-0 text-right font-mono text-fd-muted-foreground text-xs">
            {l.value}
          </span>
          <span className="truncate text-fd-muted-foreground text-xs">
            {LAYER_NOTES[l.name]}
          </span>
        </div>
      ))}
    </div>
  );
}

const ICON_SIZE_NOTES: Record<string, { tw: string; use: string }> = {
  xs: { tw: "size-3", use: "badges, xs buttons" },
  sm: { tw: "size-3.5", use: "sm buttons" },
  md: { tw: "size-4", use: "default+ controls, menus" },
  lg: { tw: "size-5", use: "empty states, callouts" },
};

/** The icon-size ladder rendered with a live Hugeicons specimen. */
export function IconSizes() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {tokens.iconSizes.map((s) => (
        <div
          className="flex items-center gap-3 rounded-lg border border-fd-border p-4"
          key={s.name}
        >
          <HugeiconsIcon
            className="shrink-0 text-foreground"
            icon={Settings01Icon}
            style={{
              width: `var(--icon-${s.name})`,
              height: `var(--icon-${s.name})`,
            }}
          />
          <div className="min-w-0">
            <code className="text-xs">
              --icon-{s.name} · {ICON_SIZE_NOTES[s.name]?.tw}
            </code>
            <div className="truncate text-fd-muted-foreground text-xs">
              {ICON_SIZE_NOTES[s.name]?.use}
            </div>
          </div>
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
          <code className="truncate text-fd-muted-foreground text-micro">
            {name}
          </code>
        </div>
      ))}
    </div>
  );
}
