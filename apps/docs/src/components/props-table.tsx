import { TypeTable } from "fumadocs-ui/components/type-table";
import type { ReactNode } from "react";
import { getComponentDoc } from "@/src/lib/component-data";

type TypeNode = {
  type: ReactNode;
  description?: ReactNode;
  default?: ReactNode;
  required?: boolean;
};

/**
 * Auto-generated reference for a component, driven by `.generated/props.json`
 * (itself produced from the component's TSDoc and cva recipes). Renders the
 * `variant`/`size` axes, the inline props, and a note for inherited props.
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

  const propRows: Record<string, TypeNode> = {};
  for (const type of doc.types) {
    for (const prop of type.props) {
      propRows[prop.name] = {
        type: prop.type,
        description: prop.description,
        default: prop.default,
        required: !prop.optional,
      };
    }
  }

  const extendsList = [...new Set(doc.types.flatMap((t) => t.extends))];

  return (
    <div className="flex flex-col gap-6">
      {variantAxes.length > 0 && (
        <section className="flex flex-col gap-2">
          <h4 className="font-medium text-sm">Variants</h4>
          <TypeTable type={variantRows} />
        </section>
      )}

      {Object.keys(propRows).length > 0 && (
        <section className="flex flex-col gap-2">
          <h4 className="font-medium text-sm">Props</h4>
          <TypeTable type={propRows} />
        </section>
      )}

      {extendsList.length > 0 && (
        <p className="text-fd-muted-foreground text-sm">
          Also accepts all props of{" "}
          {extendsList.map((ext, i) => (
            <span key={ext}>
              {i > 0 && ", "}
              <code>{ext}</code>
            </span>
          ))}
          .
        </p>
      )}
    </div>
  );
}
