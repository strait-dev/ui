"use client";

import * as React from "react";

import { cn } from "../utils/index";
import { CopyButton } from "./copy-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * The set of package-manager commands derived from (or directly supplied as)
 * an npm command string.
 */
export interface PackageManagerCommands {
  bun: string;
  npm: string;
  pnpm: string;
  yarn: string;
}

/** Package manager identifier. */
export type PackageManager = keyof PackageManagerCommands;

/**
 * Props for {@link CodeBlockCommand}.
 *
 * Supply either just `npm` (the others are auto-derived via
 * {@link convertNpmCommand}) or any combination of explicit per-manager
 * overrides. Only managers that resolve to a non-empty command will be shown.
 */
export interface CodeBlockCommandProps {
  /** Explicit bun command — overrides the derived value when `npm` is also provided. */
  bun?: string;
  /** Extra classes merged onto the outermost element. */
  className?: string;
  /** The npm command (used as-is for the `npm` tab and as the derivation source). */
  npm?: string;
  /**
   * Called after the active command has been written to the clipboard.
   *
   * @remarks
   * Only success is surfaced. Clipboard failures are silently swallowed by
   * the underlying `copy-to-clipboard` library; {@link CopyButton} does not
   * expose an `onCopyError` callback and neither does this component.
   */
  onCopySuccess?: () => void;
  /** Explicit pnpm command — overrides the derived value when `npm` is also provided. */
  pnpm?: string;
  /**
   * An AI-assistant instruction shown in an extra "AI" tab.
   *
   * When provided, a tab labelled "AI" (value `"ai"`) is appended to the
   * tab list. Its content displays `prompt` verbatim inside the same
   * monospaced `<pre>` surface and comes with its own {@link CopyButton}.
   * Useful for showing a ready-to-paste prompt that tells an AI to install
   * or configure the package being documented.
   */
  prompt?: string;
  /**
   * `localStorage` key used to persist the user's package-manager preference.
   *
   * @defaultValue `"package-manager"`
   */
  storageKey?: string;
  /** Explicit yarn command — overrides the derived value when `npm` is also provided. */
  yarn?: string;
}

// ---------------------------------------------------------------------------
// Utility — convertNpmCommand
// ---------------------------------------------------------------------------

/**
 * Derives the pnpm, yarn, and bun equivalents of a given npm command string.
 *
 * The first matching rule wins; everything after the matched prefix is kept
 * verbatim. Rules are checked in the order listed below.
 *
 * | npm form | pnpm | yarn | bun |
 * |---|---|---|---|
 * | `npm install --global …` / `npm i -g …` | `pnpm add -g …` | `yarn global add …` | `bun add -g …` |
 * | `npm install …` / `npm i …` | `pnpm add …` | `yarn add …` | `bun add …` |
 * | `npm run <script>` | `pnpm <script>` | `yarn <script>` | `bun <script>` |
 * | `npx <pkg>` | `pnpm dlx <pkg>` | `yarn dlx <pkg>` | `bunx <pkg>` |
 * | `npm create <x>` | `pnpm create <x>` | `yarn create <x>` | `bun create <x>` |
 * | `npm uninstall …` / `npm un …` | `pnpm remove …` | `yarn remove …` | `bun remove …` |
 *
 * @remarks
 * The `npm` key in the returned object is always the original input unchanged.
 * Global-flag rules must be checked before generic install rules because
 * `npm install --global` starts with `npm install`.
 *
 * @example
 * ```ts
 * convertNpmCommand("npm install react")
 * // { npm: "npm install react", pnpm: "pnpm add react", yarn: "yarn add react", bun: "bun add react" }
 *
 * convertNpmCommand("npx create-next-app@latest")
 * // { npm: "npx create-next-app@latest", pnpm: "pnpm dlx create-next-app@latest", yarn: "yarn dlx create-next-app@latest", bun: "bunx create-next-app@latest" }
 * ```
 *
 * @param npm - A valid npm command string.
 * @returns An object containing the original `npm` command and the derived
 *   `pnpm`, `yarn`, and `bun` equivalents.
 */
// Command-shape matchers, hoisted to module scope (top-level regex perf rule).
// Ordering matters: `GLOBAL_INSTALL_RE` must be tested before `INSTALL_RE`.
const GLOBAL_INSTALL_RE = /^npm\s+(?:install|i)\s+(?:--global|-g)\s*/;
const INSTALL_RE = /^npm\s+(?:install|i)\s*/;
const RUN_RE = /^npm\s+run\s+/;
const NPX_RE = /^npx\s+/;
const CREATE_RE = /^npm\s+create\s+/;
const UNINSTALL_RE = /^npm\s+(?:uninstall|un)\s*/;

export function convertNpmCommand(npm: string): PackageManagerCommands {
  // Rule 1: global install — must come before generic install.
  if (GLOBAL_INSTALL_RE.test(npm)) {
    const rest = npm.replace(GLOBAL_INSTALL_RE, "");
    return {
      npm,
      pnpm: `pnpm add -g ${rest}`.trimEnd(),
      yarn: `yarn global add ${rest}`.trimEnd(),
      bun: `bun add -g ${rest}`.trimEnd(),
    };
  }

  // Rule 2: generic install.
  if (INSTALL_RE.test(npm)) {
    const rest = npm.replace(INSTALL_RE, "");
    return {
      npm,
      pnpm: `pnpm add ${rest}`.trimEnd(),
      yarn: `yarn add ${rest}`.trimEnd(),
      bun: `bun add ${rest}`.trimEnd(),
    };
  }

  // Rule 3: npm run <script>.
  if (RUN_RE.test(npm)) {
    const script = npm.replace(RUN_RE, "");
    return {
      npm,
      pnpm: `pnpm ${script}`,
      yarn: `yarn ${script}`,
      bun: `bun ${script}`,
    };
  }

  // Rule 4: npx <pkg>.
  if (NPX_RE.test(npm)) {
    const pkg = npm.replace(NPX_RE, "");
    return {
      npm,
      pnpm: `pnpm dlx ${pkg}`,
      yarn: `yarn dlx ${pkg}`,
      bun: `bunx ${pkg}`,
    };
  }

  // Rule 5: npm create <x>.
  if (CREATE_RE.test(npm)) {
    const rest = npm.replace(CREATE_RE, "");
    return {
      npm,
      pnpm: `pnpm create ${rest}`,
      yarn: `yarn create ${rest}`,
      bun: `bun create ${rest}`,
    };
  }

  // Rule 6: uninstall.
  if (UNINSTALL_RE.test(npm)) {
    const rest = npm.replace(UNINSTALL_RE, "");
    return {
      npm,
      pnpm: `pnpm remove ${rest}`.trimEnd(),
      yarn: `yarn remove ${rest}`.trimEnd(),
      bun: `bun remove ${rest}`.trimEnd(),
    };
  }

  // No rule matched — return the original string for all managers.
  return { npm, pnpm: npm, yarn: npm, bun: npm };
}

/**
 * Resolve the per-manager command map shown in the tabs.
 *
 * When any of `pnpm`/`yarn`/`bun` are explicitly provided, only the supplied
 * managers are used. Otherwise all alternatives are derived from `npm` via
 * {@link convertNpmCommand}.
 */
function buildCommands({
  npmProp,
  pnpmProp,
  yarnProp,
  bunProp,
  hasExplicitAlternatives,
}: {
  npmProp?: string;
  pnpmProp?: string;
  yarnProp?: string;
  bunProp?: string;
  hasExplicitAlternatives: boolean;
}): Partial<PackageManagerCommands> {
  const result: Partial<PackageManagerCommands> = {};
  if (npmProp) {
    result.npm = npmProp;
  }

  if (hasExplicitAlternatives) {
    if (pnpmProp) {
      result.pnpm = pnpmProp;
    }
    if (yarnProp) {
      result.yarn = yarnProp;
    }
    if (bunProp) {
      result.bun = bunProp;
    }
    return result;
  }

  if (npmProp) {
    const derived = convertNpmCommand(npmProp);
    result.pnpm = derived.pnpm;
    result.yarn = derived.yarn;
    result.bun = derived.bun;
  }
  return result;
}

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function readStorage(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Quota exceeded or private-browsing restriction — silently ignore.
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * A package-manager command block with tabs for npm, pnpm, yarn, and bun,
 * a copy button that copies the active manager's command, and persistent
 * manager selection via `localStorage`.
 *
 * @remarks
 * - Pass only `npm` and all three other managers are derived automatically via
 *   {@link convertNpmCommand}. Pass explicit `pnpm` / `yarn` / `bun` props to
 *   override any derived value or to supply commands when no `npm` equivalent
 *   exists.
 * - Only managers that resolve to a non-empty string are rendered as tabs.
 * - The selected manager is stored in `localStorage` under `storageKey`
 *   (default `"package-manager"`). On mount the stored value is restored; if
 *   it is not in the available manager list the first available manager is used.
 *   `localStorage` access is wrapped in a `typeof window !== "undefined"` guard
 *   plus a `try/catch` so SSR and private-browsing contexts are handled safely.
 * - Copy failures are silently swallowed. `onCopySuccess` is only called on
 *   success. There is no `onCopyError` prop because `copy-to-clipboard` (used
 *   internally by {@link CopyButton}) does not surface errors.
 * - When `prompt` is provided an extra "AI" tab is shown. See
 *   {@link CodeBlockCommandProps.prompt}.
 *
 * @example
 * ```tsx
 * // Derive all four manager commands from npm:
 * <CodeBlockCommand npm="npm install @strait/ui" />
 *
 * // Explicit per-manager commands:
 * <CodeBlockCommand
 *   npm="npm install zod"
 *   pnpm="pnpm add zod"
 *   yarn="yarn add zod"
 *   bun="bun add zod"
 * />
 *
 * // With an AI prompt tab:
 * <CodeBlockCommand
 *   npm="npm install @strait/ui"
 *   prompt="Install @strait/ui and set it up following the official docs."
 * />
 * ```
 *
 * @see {@link convertNpmCommand}
 * @see {@link CopyButton}
 */
export function CodeBlockCommand({
  npm: npmProp,
  pnpm: pnpmProp,
  yarn: yarnProp,
  bun: bunProp,
  prompt,
  onCopySuccess,
  storageKey = "package-manager",
  className,
}: CodeBlockCommandProps) {
  // ── Build command map ──────────────────────────────────────────────────────
  //
  // Derivation strategy:
  // - When `npm` is the only prop provided (no explicit pnpm/yarn/bun), derive
  //   all three alternatives via `convertNpmCommand`.
  // - As soon as ANY explicit per-manager prop is supplied, only the explicitly
  //   provided managers are shown — no derivation fills in the rest. This lets
  //   callers supply a subset of managers (e.g. npm + pnpm only).
  const hasExplicitAlternatives =
    pnpmProp !== undefined || yarnProp !== undefined || bunProp !== undefined;

  const commands = React.useMemo<Partial<PackageManagerCommands>>(
    () =>
      buildCommands({
        npmProp,
        pnpmProp,
        yarnProp,
        bunProp,
        hasExplicitAlternatives,
      }),
    [npmProp, pnpmProp, yarnProp, bunProp, hasExplicitAlternatives]
  );

  /** Ordered list of available package manager tab values. */
  const availableManagers = React.useMemo<PackageManager[]>(() => {
    const order: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];
    return order.filter((m) => !!commands[m]);
  }, [commands]);

  // ── Initialise selected manager (with localStorage restore) ───────────────
  const [selected, setSelected] = React.useState<string>(() => {
    const stored = readStorage(storageKey);
    if (stored && availableManagers.includes(stored as PackageManager)) {
      return stored;
    }
    return availableManagers[0] ?? "npm";
  });

  // If available managers change and the current selection is no longer valid,
  // fall back to the first available.
  React.useEffect(() => {
    if (
      !availableManagers.includes(selected as PackageManager) &&
      selected !== "ai"
    ) {
      const fallback = availableManagers[0] ?? "npm";
      setSelected(fallback);
      writeStorage(storageKey, fallback);
    }
  }, [availableManagers, selected, storageKey]);

  const handleValueChange = React.useCallback(
    (value: string) => {
      setSelected(value);
      if (value !== "ai") {
        writeStorage(storageKey, value);
      }
    },
    [storageKey]
  );

  // ── Active command for the copy button ────────────────────────────────────
  const activeCommand = React.useMemo<string>(() => {
    if (selected === "ai") {
      return prompt ?? "";
    }
    return commands[selected as PackageManager] ?? "";
  }, [selected, commands, prompt]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className={cn("overflow-hidden rounded-lg border bg-muted", className)}
      data-slot="code-block-command"
    >
      <Tabs onValueChange={handleValueChange} value={selected}>
        {/* Top bar: tab list + copy button */}
        <div className="flex items-center justify-between px-1">
          <TabsList size="sm" variant="line">
            {availableManagers.map((manager) => (
              <TabsTrigger key={manager} value={manager}>
                {manager}
              </TabsTrigger>
            ))}
            {prompt !== undefined && <TabsTrigger value="ai">AI</TabsTrigger>}
          </TabsList>
          <CopyButton
            onCopied={onCopySuccess ? () => onCopySuccess() : undefined}
            text={activeCommand}
          />
        </div>

        {/* Command bodies — one TabsContent per manager */}
        {availableManagers.map((manager) => (
          <TabsContent key={manager} value={manager}>
            <pre className="overflow-auto p-3 font-mono text-xs leading-relaxed">
              {commands[manager]}
            </pre>
          </TabsContent>
        ))}

        {/* AI prompt tab body */}
        {prompt !== undefined && (
          <TabsContent value="ai">
            <pre className="overflow-auto p-3 font-mono text-xs leading-relaxed">
              {prompt}
            </pre>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
