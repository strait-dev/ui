import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@strait/ui/components/description-list";

export default function DescriptionListSizes() {
  return (
    <div className="flex max-w-lg flex-col gap-8">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size}>
          <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            size=&quot;{size}&quot;
          </p>
          <DescriptionList orientation="horizontal" size={size}>
            <DescriptionTerm>Plan</DescriptionTerm>
            <DescriptionDetails>Pro — billed annually</DescriptionDetails>
            <DescriptionTerm>Seats</DescriptionTerm>
            <DescriptionDetails>10 / 25 used</DescriptionDetails>
            <DescriptionTerm>Renewal</DescriptionTerm>
            <DescriptionDetails>June 1, 2026</DescriptionDetails>
          </DescriptionList>
        </div>
      ))}
    </div>
  );
}
