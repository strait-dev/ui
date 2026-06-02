import data from "@/.generated/props.json";

/** A single inline-declared prop on a `*Props` type. */
export type PropDoc = {
  name: string;
  type: string;
  optional: boolean;
  default?: string;
  description?: string;
};

/** One exported `*Props` type: its inline members plus the types it extends. */
export type TypeDoc = {
  name: string;
  props: PropDoc[];
  extends: string[];
};

/**
 * The generated model for one component, mirroring the `ComponentDoc` shape
 * emitted by `scripts/generate-llms.ts` into `.generated/props.json`.
 */
export type ComponentDoc = {
  name: string;
  importPath: string;
  category: string;
  description: string;
  exports: string[];
  types: TypeDoc[];
  variants: Record<string, string[]>;
  defaultVariants: Record<string, string>;
  slots: string[];
  dependencies: string[];
};

const components = data as Record<string, ComponentDoc>;

/** Look up the generated model for a component by its slug (e.g. `button`). */
export function getComponentDoc(slug: string): ComponentDoc | undefined {
  return components[slug];
}

/** All component models, keyed by slug. */
export function getAllComponents(): Record<string, ComponentDoc> {
  return components;
}
