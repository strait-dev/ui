import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@strait/ui/components/description-list";

export default function DescriptionListDemo() {
  return (
    <div className="w-96">
      <DescriptionList divided orientation="horizontal">
        <DescriptionTerm>Plan</DescriptionTerm>
        <DescriptionDetails>Pro — billed annually</DescriptionDetails>
        <DescriptionTerm>Region</DescriptionTerm>
        <DescriptionDetails>us-east-1</DescriptionDetails>
        <DescriptionTerm>Members</DescriptionTerm>
        <DescriptionDetails>12 seats</DescriptionDetails>
        <DescriptionTerm>Renewal</DescriptionTerm>
        <DescriptionDetails>January 15, 2026</DescriptionDetails>
      </DescriptionList>
    </div>
  );
}
