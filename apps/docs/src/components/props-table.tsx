import { TypeTable } from "fumadocs-ui/components/type-table";
import type { ReactNode } from "react";
import { getComponentDoc, type PropDoc } from "@/src/lib/component-data";

type TypeNode = {
  type: ReactNode;
  description?: ReactNode;
  default?: ReactNode;
  required?: boolean;
};

function toRows(props: PropDoc[]): Record<string, TypeNode> {
  const rows: Record<string, TypeNode> = {};
  for (const prop of props) {
    rows[prop.name] = {
      type: prop.type,
      description: prop.description,
      default: prop.default,
      required: !prop.optional,
    };
  }
  return rows;
}

/**
 * Auto-generated reference for a component, driven by `.generated/props.json`.
 * Renders the variant axes, inline props, type-checker-resolved inherited props
 * (HTML globals filtered to a note), and the compound-component anatomy — all
 * from the generated model, so every component page gets a complete reference
 * with no per-page authoring.
 */
export function PropsTable({ name }: { name: string }) {
  const doc = getComponentDoc(name);
  if (!doc) {
    return (
      <p className="text-fd-muted-foreground text-sm">
        No generated reference found for <code>{name}</code>.
      </p>
    );
  }

  const variantAxes = Object.keys(doc.variants);
  const variantRows: Record<string, TypeNode> = {};
  for (const axis of variantAxes) {
    variantRows[axis] = {
      type: doc.variants[axis].map((v) => `"${v}"`).join(" | "),
      default: doc.defaultVariants[axis]
        ? `"${doc.defaultVariants[axis]}"`
        : undefined,
    };
  }

  const inlineRows = toRows(doc.types.flatMap((t) => t.props));
  const inheritedRows = toRows(doc.types.flatMap((t) => t.inheritedProps));
  const htmlTags = [...new Set(doc.types.flatMap((t) => t.extendsHtml))];
  const parts = doc.parts.filter((p) => p.slot);

  return (
    <div className="flex flex-col gap-6">
      {variantAxes.length > 0 && (
        <section className="flex flex-col gap-2">
          <h4 className="font-medium text-sm">Variants</h4>
          <TypeTable type={variantRows} />
        </section>
      )}

      {Object.keys(inlineRows).length > 0 && (
        <section className="flex flex-col gap-2">
          <h4 className="font-medium text-sm">Props</h4>
          <TypeTable type={inlineRows} />
        </section>
      )}

      {Object.keys(inheritedRows).length > 0 && (
        <section className="flex flex-col gap-2">
          <h4 className="font-medium text-sm">Inherited props</h4>
          <TypeTable type={inheritedRows} />
        </section>
      )}

      {htmlTags.length > 0 && (
        <p className="text-fd-muted-foreground text-sm">
          Also accepts all native{" "}
          {htmlTags.map((tag, i) => (
            <span key={tag}>
              {i > 0 && ", "}
              <code>&lt;{tag}&gt;</code>
            </span>
          ))}{" "}
          attributes.
        </p>
      )}

      {parts.length > 1 && (
        <section className="flex flex-col gap-2">
          <h4 className="font-medium text-sm">Anatomy</h4>
          <table className="text-sm">
            <thead>
              <tr>
                <th className="text-left">Part</th>
                <th className="text-left">Data slot</th>
                <th className="text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((part) => (
                <tr key={part.name}>
                  <td>
                    <code>{part.name}</code>
                  </td>
                  <td>
                    <code>{part.slot}</code>
                  </td>
                  <td>{part.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
