import { Label } from "@strait/ui/components/label";
import MultipleSelector, {
  type Option,
} from "@strait/ui/components/multiselect";

const skillOptions: Option[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "typescript", label: "TypeScript" },
  { value: "node", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
];

export default function MultiselectSizes() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Default size</Label>
        <MultipleSelector
          defaultOptions={skillOptions}
          emptyIndicator={
            <p className="text-center text-muted-foreground text-sm">
              No results.
            </p>
          }
          placeholder="Select skills…"
          size="default"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Small size</Label>
        <MultipleSelector
          defaultOptions={skillOptions}
          emptyIndicator={
            <p className="text-center text-muted-foreground text-xs">
              No results.
            </p>
          }
          placeholder="Select skills…"
          size="sm"
        />
      </div>
    </div>
  );
}
