import { AspectRatio } from "@strait/ui/components/aspect-ratio";

const ratios = [
  { label: "16:9", ratio: 16 / 9 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "1:1", ratio: 1 },
];

export default function AspectRatioCommonRatios() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-3 gap-4">
      {ratios.map(({ label, ratio }) => (
        <div key={label}>
          <AspectRatio
            className="overflow-hidden rounded-lg bg-muted"
            ratio={ratio}
          >
            <div className="flex size-full items-center justify-center font-mono text-muted-foreground text-sm">
              {label}
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  );
}
