// scripts/check-conventions.mjs
// Enforces the Component Contract (docs/component-contract.md).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "packages/ui/src/components";
const files = readdirSync(DIR).filter(
  (f) =>
    f.endsWith(".tsx") &&
    !f.endsWith(".stories.tsx") &&
    !f.endsWith(".test.tsx")
);

// Per-rule exemptions: { ruleId: Set<filename> }
// Only headless components that render NO DOM of their own are exempt from
// data-slot: direction.tsx is a provider re-export, checkbox-tree.tsx is a
// render-prop where the consumer owns all the markup, and notice-banner.tsx is
// a thin re-export shim over banner.tsx. Every other rule applies to every
// component with no exceptions.
const EXEMPT = {
  rawColor: new Set([]),
  dataSlot: new Set([
    "direction.tsx",
    "checkbox-tree.tsx",
    "notice-banner.tsx",
  ]),
  // charts.tsx's only className is a static internal recharts SVG label (no
  // consumer passthrough); checkbox-tree.tsx's only className lives in a JSDoc
  // @example block, not real markup.
  cn: new Set(["charts.tsx", "checkbox-tree.tsx"]),
  // command-menu.tsx uses React.HTMLAttributes<HTMLElement> only for internal
  // cloneElement annotations on an unknown trigger element, where there is no
  // ComponentProps equivalent — these are not component prop definitions.
  propTyping: new Set(["command-menu.tsx"]),
  // ---- API-naming rules (§11–§14), added during the convergence tracked in
  // docs/api-consistency-audit.md. Each set grandfathers the CURRENT violators
  // only — any NEW component that breaks the rule fails the build. Shrink each
  // set toward empty as components are migrated. ----
  // §14: Base UI `render`, never Radix `asChild`. credenza.tsx is a permanent,
  // legitimate exemption: its `asChild` lands on `DrawerTrigger`/`DrawerClose`,
  // which are thin re-exports of vaul's primitives, and vaul's polymorphism API
  // *is* `asChild` (there is no `render` equivalent). The desktop branch already
  // uses `render` on the Base UI Dialog parts; only the vaul branch needs
  // `asChild`. (tree.tsx was a false positive — its matches were the substring
  // `hasChildItems`, not a real `asChild` prop.)
  asChild: new Set(["credenza.tsx"]),
  // §13: every component exports a named `*Props` type. Only the two headless
  // components are exempt — direction.tsx re-exports Base UI's
  // DirectionProvider (no props of its own) and checkbox-tree.tsx is a
  // render-prop where the consumer owns the markup. Every other component
  // already complies via the brace re-export form.
  namedProps: new Set(["direction.tsx", "checkbox-tree.tsx"]),
  // §11: the semantic cva axis is named `variant` (or `status`/`shape`).
  // The intent→variant migration is complete; no files are grandfathered.
  intentAxis: new Set([]),
  // §12: boolean props/flags unprefixed + positively phrased.
  // Files fully migrated in refactor/unify-radius (all public is*/has*/hide*
  // props renamed): date-picker.tsx, input-with-loader.tsx,
  // navigation-rail.tsx, pagination.tsx, select-with-search.tsx — removed.
  // checkbox-tree.tsx — removed (renderNode `isChecked` param renamed to `checked`).
  // Remaining entries retain ONLY internal/private names:
  //   calendar-rac.tsx   — isRange (private calendar-rac param)
  //   chart.tsx          — hideIndicator (private renderIndicator function param)
  //   code-block-command.tsx — hasExplicitAlternatives (private param)
  //   credenza.tsx       — isDesktop (private context field)
  //   data-grid.tsx      — isLoading (DataGridContextProps & private function params),
  //                        isInfiniteMode, isFetchingMore, hasMore (private params)
  //   date-selector.tsx  — isRange (private context/param)
  //   file-upload.tsx    — isDragging (FileUploadState hook-return field, internal)
  //   json-viewer.tsx    — isLast (private param)
  //   multiselect.tsx    — isOpen (×3 private hook types), isLoading (~686 private)
  //   sidebar.tsx        — isMobile (context), SidebarMenuItemSubItem.isActive (~1262)
  //   sortable.tsx       — isDragging (context)
  //   stepper.tsx        — isDisabled/isLoading (context)
  boolNaming: new Set([
    "calendar-rac.tsx",
    "chart.tsx",
    "code-block-command.tsx",
    "credenza.tsx",
    "data-grid.tsx",
    "date-selector.tsx",
    "file-upload.tsx",
    "json-viewer.tsx",
    "multiselect.tsx",
    "sidebar.tsx",
    "sortable.tsx",
    "stepper.tsx",
  ]),
  // §9 radius rule exemptions.
  //
  // radius (rounded-xl/2xl/3xl/4xl): badge.tsx uses rounded-4xl intentionally
  // for its opt-in `pill` radius variant value — this is the only sanctioned
  // use of a large radius in component chrome.
  radius: new Set(["badge.tsx"]),
  //
  // roundedFull: the following files use rounded-full for genuinely circular
  // controls, dots, handles, thumbs, or pill opt-ins — NOT rectangular outer
  // boxes. Each entry is annotated with its circular justification.
  roundedFull: new Set([
    "switch.tsx", // switch thumb is a circular pill handle
    "radio-group.tsx", // radio indicator is a circular dot
    "slider.tsx", // slider thumb is a circular handle
    "progress.tsx", // progress bar track and fill are circular-capped
    "status-badge.tsx", // status dot indicators are circular
    "avatar.tsx", // avatar is a circular image container
    "activity-feed.tsx", // activity feed uses circular avatar/dot elements
    "chart.tsx", // recharts uses circular dot legend markers
    "charts.tsx", // recharts uses circular dot legend markers
    "carousel.tsx", // carousel prev/next nav buttons are circular icon buttons
    "scroll-area.tsx", // scrollbar thumb is a circular-capped pill
    "skeleton.tsx", // skeleton circle variant is a circular placeholder
    "data-grid.tsx", // data-grid scrollbar thumbs are circular-capped
    "sidebar.tsx", // sidebar has circular avatar wrapper and active-rail dots
    "drawer.tsx", // drawer drag handle is a circular pill indicator
    "filters.tsx", // filter chip has an opt-in pill/full-radius mode
    "phone-input.tsx", // flag icons are circular (CircleFlag component)
    "badge.tsx", // badge dismiss button and dot are circular; pill radius opt-in
  ]),
};

// Files subject to the §18 control-height ladder (DESIGN.md §4): interactive
// controls whose size axis must sit on h-6 / h-7 / h-8 / h-9 / h-10
// (xs / sm / default / lg / xl). Inner elements are unconstrained — the rule
// only inspects size-variant definitions and data-[size=…] height utilities.
const CONTROL_FILES = new Set([
  "autocomplete.tsx",
  "button.tsx",
  "date-input.tsx",
  "input-otp.tsx",
  "input-with-inline-button.tsx",
  "input.tsx",
  "multiselect.tsx",
  "native-select.tsx",
  "number-input-percentage-with-chevrons.tsx",
  "number-input-with-buttons.tsx",
  "number-input-with-chevrons.tsx",
  "password-input.tsx",
  "phone-input.tsx",
  "secret-input.tsx",
  "select-with-search-and-button.tsx",
  "select-with-search.tsx",
  "select.tsx",
]);

// The canonical control-height ladder: size step → required h-* value.
const CONTROL_LADDER = {
  xs: "6",
  sm: "7",
  default: "8",
  lg: "9",
  xl: "10",
};

const RAW_COLOR =
  /\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d{2,3}\b/;

const violations = [];
function add(file, rule, detail) {
  violations.push(`${file} [${rule}] ${detail}`);
}

for (const file of files) {
  const src = readFileSync(join(DIR, file), "utf8");
  const lines = src.split("\n");

  // Rule: no raw palette colors (also catches bg-white / text-white in chrome)
  if (!EXEMPT.rawColor.has(file)) {
    lines.forEach((ln, i) => {
      if (RAW_COLOR.test(ln)) {
        add(file, "rawColor", `:${i + 1} ${ln.trim().slice(0, 80)}`);
      }
      if (/\b(?:bg|text)-white\b/.test(ln) && !/sr-only/.test(ln)) {
        add(file, "rawColor", `:${i + 1} bg/text-white`);
      }
    });
  }

  // Rule: broad transitions are too easy to over-animate. Components should
  // transition the specific properties they visually change.
  lines.forEach((ln, i) => {
    if (/\btransition-all\b/.test(ln)) {
      add(
        file,
        "transitionAll",
        `:${i + 1} transition-all (use explicit transition-* utilities)`
      );
    }
  });

  // Rule: overlay scrims use the themeable overlay token, not hard-coded black.
  lines.forEach((ln, i) => {
    if (
      /data-slot="[\w-]*overlay"|[\w-]*overlay/.test(src) &&
      /\bbg-black\//.test(ln)
    ) {
      add(
        file,
        "overlayToken",
        `:${i + 1} overlay scrim uses bg-black/* (use bg-overlay)`
      );
    }
  });

  // Rule: focus ring must be ring-3 (not ring-1, ring-2, ring-4+).
  // Only flags *focus* rings: focus-visible:ring-N, data-[focus-visible]:ring-N,
  // focus-within:ring-offset. Plain surface frames like ring-1 ring-foreground/10
  // are intentional and NOT flagged (no focus-* prefix). ring-0 suppressions on
  // inner elements (InputGroup inner input, filter chip inner input) are also
  // intentional — only widths 1, 2, 4, 5+ are non-compliant.
  lines.forEach((ln, i) => {
    // focus-visible:ring-<width> — flag widths 1, 2, 4, 5, 6, 7, 8, 9 (not 0 or 3)
    const fvMatches = ln.match(/focus-visible:ring-([1-9])\b/g) || [];
    for (const m of fvMatches) {
      const width = Number(m.replace("focus-visible:ring-", ""));
      if (width !== 3) {
        add(
          file,
          "focusRing",
          `:${i + 1} focus-visible:ring-${width} (use ring-3)`
        );
      }
    }
    // data-[focus-visible]:ring-<width> — attribute-selector form used by RAC
    const dfvMatches = ln.match(/data-\[focus-visible\]:ring-([1-9])\b/g) || [];
    for (const m of dfvMatches) {
      const width = Number(m.replace("data-[focus-visible]:ring-", ""));
      if (width !== 3) {
        add(
          file,
          "focusRing",
          `:${i + 1} data-[focus-visible]:ring-${width} (use ring-3)`
        );
      }
    }
    // focus-within:ring-offset — retired offset pattern
    if (/focus-within:ring-offset/.test(ln)) {
      add(
        file,
        "focusRing",
        `:${i + 1} focus-within:ring-offset (remove; use border-ring instead)`
      );
    }
    // Legacy focus-visible:ring-offset (keep for safety)
    if (/focus-visible:ring-offset/.test(ln)) {
      add(
        file,
        "focusRing",
        `:${i + 1} focus-visible:ring-offset (retired pattern)`
      );
    }
  });

  // Rule intentOpacity (§intent-opacity): warning opacity values must match the
  // brand/destructive/success/info families. Flags the specific divergent values
  // that existed before the 0.1.x consistency fix — if any reappear, the build
  // fails. Only meaningful in button.tsx but runs globally (cheap, no false-pos).
  //   - border-warning/50  → retired (use /40)
  //   - ring-warning/40    → retired focus ring opacity (use /30 solid, /20 soft/outline)
  //   - bg-warning/25      → retired light-mode soft resting fill (use /10 light, /15 dark:)
  //     NOTE: dark:hover:bg-warning/25 is ALLOWED (dark-mode hover is intentional);
  //     only bare bg-warning/25 without a dark: modifier is flagged.
  lines.forEach((ln, i) => {
    if (/\bborder-warning\/50\b/.test(ln)) {
      add(
        file,
        "intentOpacity",
        `:${i + 1} border-warning/50 retired (use /40)`
      );
    }
    if (/\bring-warning\/40\b/.test(ln)) {
      add(
        file,
        "intentOpacity",
        `:${i + 1} ring-warning/40 retired (use /30 solid, /20 soft/outline)`
      );
    }
    // Flag bg-warning/25 only when it is NOT preceded by a dark: context modifier.
    // Splits the line into space-separated tokens and checks each individually.
    for (const token of ln.split(/\s+/)) {
      if (/^bg-warning\/25\b/.test(token)) {
        add(
          file,
          "intentOpacity",
          `:${i + 1} bg-warning/25 retired resting fill (use /10 light, /15 dark only)`
        );
      }
    }
  });

  // Rule §16 (fontSize): no arbitrary text-[…] values — the type scale plus
  // text-micro are the only sanctioned steps (DESIGN.md §1).
  lines.forEach((ln, i) => {
    if (/\btext-\[[^\]]+\]/.test(ln)) {
      add(
        file,
        "fontSize",
        `:${i + 1} arbitrary text-[…] (use the type scale; text-micro is the smallest step)`
      );
    }
  });

  // Rule §17 (shadowToken): arbitrary shadow values may not embed raw colors.
  // Token-colored arbitrary shadows (var(--border) hairlines etc.) stay legal;
  // literal rgb/hsl/oklch/hex colors must move to a token (DESIGN.md §6).
  lines.forEach((ln, i) => {
    const shadows = ln.match(/(?:drop-|inset-)?shadow-\[[^\]]*\]/g) || [];
    for (const s of shadows) {
      if (/#[0-9a-fA-F]|(?:rgba?|hsla?|oklch|oklab)\(\s*(?!var\()/.test(s)) {
        add(
          file,
          "shadowToken",
          `:${i + 1} raw color in ${s.slice(0, 60)} (use shadow-sm/md/lg or a var(--token) color)`
        );
      }
    }
  });

  // Rule §18 (controlHeight): control size variants sit on the h-6…h-10
  // ladder. Checks the data-[size=…]:h-N form and single-line cva size
  // entries (`lg: "h-9 …"`); inner-element heights are not inspected.
  if (CONTROL_FILES.has(file)) {
    lines.forEach((ln, i) => {
      for (const m of ln.matchAll(
        /data-\[size=(xs|sm|default|lg|xl)\]:h-([\d.]+)/g
      )) {
        if (m[2] !== CONTROL_LADDER[m[1]]) {
          add(
            file,
            "controlHeight",
            `:${i + 1} data-[size=${m[1]}]:h-${m[2]} (ladder requires h-${CONTROL_LADDER[m[1]]})`
          );
        }
      }
      const variantLine = ln.match(
        /^\s*"?(xs|sm|default|lg|xl)"?:\s*"([^"]*)"/
      );
      if (variantLine) {
        const [, step, classes] = variantLine;
        for (const h of classes.matchAll(/(?<![\w-])h-([\d.]+)\b/g)) {
          if (h[1] !== CONTROL_LADDER[step]) {
            add(
              file,
              "controlHeight",
              `:${i + 1} size ${step} uses h-${h[1]} (ladder requires h-${CONTROL_LADDER[step]})`
            );
          }
        }
      }
    });
  }

  // Rule §19 (zIndexToken): stacking contexts take a layer token via
  // z-(--z-*) — no raw z-30/z-40/z-50 or arbitrary z-[N] (DESIGN.md §8).
  // z-10 / z-20 remain legal for local overlap inside a component's own
  // stacking context (pinned cells, inset icons), which the layer ladder
  // does not govern.
  lines.forEach((ln, i) => {
    if (/\bz-(?:30|40|50)\b|\bz-\[/.test(ln)) {
      add(
        file,
        "zIndexToken",
        `:${i + 1} raw z-index (use z-(--z-sticky|overlay|modal|popover|toast|tooltip))`
      );
    }
  });

  // Rule §5 (motionToken): no raw durations in transitions/animations — use
  // duration-(--duration-*) so motion stays on the token ladder and exits can
  // run one step faster than enters (DESIGN.md §7).
  lines.forEach((ln, i) => {
    if (/\bduration-\d|\bduration-\[/.test(ln)) {
      add(
        file,
        "motionToken",
        `:${i + 1} raw duration (use duration-(--duration-instant|fast|base|slow|deliberate))`
      );
    }
  });

  // Rule: aria-invalid ring must include width when color present
  lines.forEach((ln, i) => {
    if (
      /aria-invalid:ring-destructive\//.test(ln) &&
      !/aria-invalid:ring-3/.test(src)
    ) {
      add(file, "ariaInvalid", `:${i + 1} missing aria-invalid:ring-3`);
    }
  });

  // Rule: must import cn and merge className (skip pure re-exports)
  const usesClassName = /className/.test(src);
  if (
    usesClassName &&
    !EXEMPT.cn.has(file) &&
    !/from "\.\.\/utils\/index"/.test(src)
  ) {
    add(
      file,
      "cn",
      "uses className but does not import cn from ../utils/index"
    );
  }
  if (/className=\{`/.test(src)) {
    add(file, "cn", "template-literal className (use cn())");
  }

  // Rule: "use client" present iff interactive
  const interactive =
    /\buse(State|Effect|Ref|Callback|Memo|Context|Reducer|Id)\b|onClick=|onChange=|onKeyDown=/.test(
      src
    );
  const hasDirective = /^["']use client["'];/.test(src.trimStart());
  if (interactive && !hasDirective) {
    add(file, "useClient", 'interactive but missing "use client"');
  }

  // Rule: root data-slot present (JSX attr `data-slot=` or, for useRender/
  // mergeProps components, the object-property form `"data-slot":`)
  if (!(EXEMPT.dataSlot.has(file) || /data-slot["']?\s*[:=]/.test(src))) {
    add(file, "dataSlot", "no data-slot anywhere");
  }

  // Rule: no React.HTMLAttributes / InputHTMLAttributes (prefer ComponentProps)
  if (!EXEMPT.propTyping.has(file)) {
    lines.forEach((ln, i) => {
      if (
        /React\.(HTMLAttributes|InputHTMLAttributes|TextareaHTMLAttributes)</.test(
          ln
        )
      ) {
        add(file, "propTyping", `:${i + 1} prefer React.ComponentProps<...>`);
      }
    });
  }

  // Rule §14: polymorphism via Base UI `render`, never Radix `asChild`.
  if (!EXEMPT.asChild.has(file) && /\basChild\b/.test(src)) {
    add(file, "asChild", "uses asChild (use the Base UI render prop)");
  }

  // Rule §13: a named `*Props` type/interface is exported. Accept every export
  // form the library uses: inline (`export type/interface XProps`), the
  // value-and-type brace re-export (`export { X, type XProps }`), and the
  // type-only brace block (`export type { XProps, ... }`, often multi-line).
  // `[^}]` spans newlines, so the brace form matches across lines.
  const exportsProps =
    /export\s+(?:type|interface)\s+\w+Props\b/.test(src) ||
    /export\s+(?:type\s+)?\{[^}]*\b\w+Props\b[^}]*\}/.test(src);
  if (!(EXEMPT.namedProps.has(file) || exportsProps)) {
    add(file, "namedProps", "no exported *Props type");
  }

  // Rule §11: the semantic cva axis is named `variant`, not `intent`.
  if (!EXEMPT.intentAxis.has(file) && /\bintent:\s*\{/.test(src)) {
    add(file, "intentAxis", "cva axis named `intent` (use `variant`/`status`)");
  }

  // Rule §12: boolean props/flags unprefixed + positively phrased.
  if (!EXEMPT.boolNaming.has(file)) {
    lines.forEach((ln, i) => {
      if (/\b(?:is|has)[A-Z][A-Za-z]*\??:\s*boolean\b/.test(ln)) {
        add(file, "boolNaming", `:${i + 1} ${ln.trim().slice(0, 50)}`);
      }
      if (/\bhide[A-Z][A-Za-z]*\??:\s*boolean\b/.test(ln)) {
        add(file, "boolNaming", `:${i + 1} ${ln.trim().slice(0, 50)}`);
      }
    });
  }

  // Rule §9 (radius): outer-box corners must be rounded-lg; large radii and
  // rounded-full are banned outside their respective allowlists.
  if (!EXEMPT.radius.has(file)) {
    lines.forEach((ln, i) => {
      if (
        /\brounded(?:-(t|b|l|r|s|e|tl|tr|bl|br))?-(xl|2xl|3xl|4xl)\b/.test(ln)
      ) {
        add(
          file,
          "radius",
          `:${i + 1} rounded-xl/2xl/3xl/4xl on outer box (use rounded-lg)`
        );
      }
    });
  }
  if (!EXEMPT.roundedFull.has(file)) {
    lines.forEach((ln, i) => {
      if (/\brounded-full\b/.test(ln)) {
        add(
          file,
          "radius",
          `:${i + 1} rounded-full on non-circular component (only circular controls may use it)`
        );
      }
    });
  }
}

if (violations.length) {
  console.error(`\n✗ ${violations.length} convention violations:\n`);
  for (const v of violations) {
    console.error(`  ${v}`);
  }
  process.exit(1);
}
console.log("✓ All components follow the component contract.");
