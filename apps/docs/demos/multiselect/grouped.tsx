import { Label } from "@strait/ui/components/label";
import MultipleSelector, {
  type Option,
} from "@strait/ui/components/multiselect";

const groupedOptions: Option[] = [
  { value: "react", label: "React", category: "Frontend" },
  { value: "vue", label: "Vue", category: "Frontend" },
  { value: "svelte", label: "Svelte", category: "Frontend" },
  { value: "node", label: "Node.js", category: "Backend" },
  { value: "python", label: "Python", category: "Backend" },
  { value: "go", label: "Go", category: "Backend" },
];

export default function MultiselectGrouped() {
  return (
    <div className="flex w-80 flex-col gap-1.5">
      <Label>Technologies by area</Label>
      <MultipleSelector
        defaultOptions={groupedOptions}
        emptyIndicator={
          <p className="text-center text-muted-foreground text-sm">
            No options.
          </p>
        }
        groupBy="category"
        placeholder="Search technologies…"
      />
    </div>
  );
}
