"use client";

import * as React from "react";

import { cn } from "../utils/index";
import { CopyButton } from "./copy-button";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns `true` when `value` is a plain, non-null object (not an array). */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Resolves the initial expanded state for a node at the given depth. */
function resolveExpanded(
  defaultExpanded: boolean | number,
  depth: number
): boolean {
  if (typeof defaultExpanded === "boolean") {
    return defaultExpanded;
  }
  return depth < defaultExpanded;
}

/** Renders a colorised primitive value as a `<span>`. */
function PrimitiveValue({ value }: { value: unknown }): React.ReactElement {
  if (value === null) {
    return <span className="text-warning-accent">null</span>;
  }
  if (typeof value === "boolean") {
    return <span className="text-warning-accent">{String(value)}</span>;
  }
  if (typeof value === "number") {
    return <span className="text-info-accent">{String(value)}</span>;
  }
  if (typeof value === "string") {
    return <span className="text-success-accent">&quot;{value}&quot;</span>;
  }
  // Fallback for undefined or other primitives
  return <span className="text-warning-accent">{String(value)}</span>;
}

/** Small inline chevron that rotates when expanded. */
function Chevron({ expanded }: { expanded: boolean }): React.ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "inline-block size-3 shrink-0 transition-transform",
        expanded ? "rotate-90" : "rotate-0"
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Renders the key label + colon separator when a label is provided. */
function NodeLabel({
  label,
}: {
  label: React.ReactNode;
}): React.ReactElement | null {
  if (label === undefined) {
    return null;
  }
  return (
    <>
      <span className="text-foreground">{label}</span>
      <span className="text-muted-foreground/60">:</span>
    </>
  );
}

/** Toggle button with chevron for collapsible nodes. */
function ToggleButton({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}): React.ReactElement {
  return (
    <button
      aria-expanded={expanded}
      aria-label={expanded ? "Collapse" : "Expand"}
      className="inline-flex items-center gap-0.5 rounded-sm text-foreground opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      onClick={onToggle}
      type="button"
    >
      <Chevron expanded={expanded} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// JsonNode — recursive renderer (forward-declared via props interface)
// ---------------------------------------------------------------------------

interface JsonNodeProps {
  defaultExpanded: boolean | number;
  depth: number;
  isLast?: boolean;
  label?: React.ReactNode;
  value: unknown;
}

/** Renders an array node with collapsible children. */
function ArrayNode({
  value,
  label,
  depth,
  defaultExpanded,
  isLast = true,
}: JsonNodeProps & { value: unknown[] }): React.ReactElement {
  const [expanded, setExpanded] = React.useState(() =>
    resolveExpanded(defaultExpanded, depth)
  );
  const indentStyle = { paddingLeft: `${depth * 16}px` };
  const count = value.length;

  function handleToggle() {
    setExpanded((prev) => !prev);
  }

  return (
    <div>
      <div className="flex items-center gap-1" style={indentStyle}>
        <ToggleButton expanded={expanded} onToggle={handleToggle} />
        <NodeLabel label={label} />
        <span className="text-muted-foreground/60">{"["}</span>
        {!expanded && (
          <>
            <span className="text-muted-foreground/60 italic">…</span>
            <span className="text-muted-foreground/60">{"]"}</span>
            <span className="ml-1 text-muted-foreground/40 text-xs">
              {count} {count === 1 ? "item" : "items"}
            </span>
          </>
        )}
      </div>
      {expanded && (
        <>
          <div>
            {value.map((item, idx) => (
              <JsonNode
                defaultExpanded={defaultExpanded}
                depth={depth + 1}
                isLast={idx === value.length - 1}
                // biome-ignore lint/suspicious/noArrayIndexKey: index is the stable key for array items in a viewer
                key={idx}
                label={String(idx)}
                value={item}
              />
            ))}
          </div>
          <div style={indentStyle}>
            <span className="text-muted-foreground/60">{"]"}</span>
            {!isLast && <span className="text-muted-foreground/60">,</span>}
          </div>
        </>
      )}
    </div>
  );
}

/** Renders a plain-object node with collapsible children. */
function ObjectNode({
  value,
  label,
  depth,
  defaultExpanded,
  isLast = true,
}: JsonNodeProps & { value: Record<string, unknown> }): React.ReactElement {
  const [expanded, setExpanded] = React.useState(() =>
    resolveExpanded(defaultExpanded, depth)
  );
  const indentStyle = { paddingLeft: `${depth * 16}px` };
  const entries = Object.entries(value);
  const count = entries.length;

  function handleToggle() {
    setExpanded((prev) => !prev);
  }

  return (
    <div>
      <div className="flex items-center gap-1" style={indentStyle}>
        <ToggleButton expanded={expanded} onToggle={handleToggle} />
        <NodeLabel label={label} />
        <span className="text-muted-foreground/60">{"{"}</span>
        {!expanded && (
          <>
            <span className="text-muted-foreground/60 italic">…</span>
            <span className="text-muted-foreground/60">{"}"}</span>
            <span className="ml-1 text-muted-foreground/40 text-xs">
              {count} {count === 1 ? "key" : "keys"}
            </span>
          </>
        )}
      </div>
      {expanded && (
        <>
          <div>
            {entries.map(([key, val], idx) => (
              <JsonNode
                defaultExpanded={defaultExpanded}
                depth={depth + 1}
                isLast={idx === entries.length - 1}
                key={key}
                label={
                  <span className="text-foreground">&quot;{key}&quot;</span>
                }
                value={val}
              />
            ))}
          </div>
          <div style={indentStyle}>
            <span className="text-muted-foreground/60">{"}"}</span>
            {!isLast && <span className="text-muted-foreground/60">,</span>}
          </div>
        </>
      )}
    </div>
  );
}

/** Dispatches to the appropriate node renderer based on value type. */
function JsonNode({
  value,
  label,
  depth,
  defaultExpanded,
  isLast = true,
}: JsonNodeProps): React.ReactElement {
  const indentStyle = { paddingLeft: `${depth * 16}px` };

  if (Array.isArray(value)) {
    return (
      <ArrayNode
        defaultExpanded={defaultExpanded}
        depth={depth}
        isLast={isLast}
        label={label}
        value={value}
      />
    );
  }

  if (isPlainObject(value)) {
    return (
      <ObjectNode
        defaultExpanded={defaultExpanded}
        depth={depth}
        isLast={isLast}
        label={label}
        value={value}
      />
    );
  }

  // Primitive
  return (
    <div className="flex items-baseline gap-1" style={indentStyle}>
      <NodeLabel label={label} />
      <PrimitiveValue value={value} />
      {!isLast && <span className="text-muted-foreground/60">,</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// JsonViewer — public API
// ---------------------------------------------------------------------------

/**
 * Props for {@link JsonViewer}.
 */
interface JsonViewerProps {
  /** Additional class names applied to the root element. */
  className?: string;
  /** When `true`, a {@link CopyButton} is shown in the top-right corner. */
  copyable?: boolean;
  /** The JSON-serialisable value to display. */
  data: unknown;
  /**
   * Controls how deep the tree is initially expanded.
   * - `true` — expand all nodes.
   * - `false` — collapse all nodes.
   * - `number` — expand nodes whose depth is less than this value (root = 0).
   *
   * Defaults to `1` (root object/array open, children collapsed).
   */
  defaultExpanded?: boolean | number;
  /**
   * Constrains the viewer height. Accepts any CSS `max-height` value or a
   * pixel number.
   */
  maxHeight?: number | string;
  /** Optional label rendered at the top-left of the root node. */
  rootLabel?: React.ReactNode;
}

/**
 * Hand-rolled recursive, collapsible, colorised JSON tree viewer.
 *
 * Renders any JSON-serialisable value without an external highlighting
 * dependency. Objects and arrays are collapsible; primitives are colour-coded
 * by type using semantic design-system tokens.
 *
 * @remarks
 * - Colour conventions: strings → `text-success-accent`, numbers →
 *   `text-info-accent`, booleans and `null` → `text-warning-accent`, keys →
 *   `text-foreground`.
 * - `defaultExpanded` seeds each node's local state on mount; subsequent
 *   user interactions are independent per-node. Changing the prop after mount
 *   has no effect (pass a `key` to reset).
 * - Circular references are not guarded against — assume plain JSON-able data.
 *
 * @example
 * ```tsx
 * <JsonViewer
 *   data={{ status: "ok", items: [1, 2, 3] }}
 *   defaultExpanded={2}
 *   copyable
 *   maxHeight={400}
 * />
 * ```
 */
function JsonViewer({
  data,
  defaultExpanded = 1,
  rootLabel,
  copyable = false,
  maxHeight,
  className,
}: JsonViewerProps) {
  let maxHeightStyle: string | undefined;
  if (maxHeight !== undefined) {
    maxHeightStyle =
      typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  }

  return (
    <div
      className={cn(
        "relative overflow-auto rounded-lg border bg-muted p-3 font-mono text-xs",
        className
      )}
      data-slot="json-viewer"
      style={maxHeightStyle ? { maxHeight: maxHeightStyle } : undefined}
    >
      {copyable && (
        <div className="absolute top-2 right-2">
          <CopyButton
            aria-label="Copy JSON"
            text={JSON.stringify(data, null, 2)}
          />
        </div>
      )}
      <JsonNode
        defaultExpanded={defaultExpanded}
        depth={0}
        label={rootLabel}
        value={data}
      />
    </div>
  );
}

export { JsonViewer, type JsonViewerProps };
