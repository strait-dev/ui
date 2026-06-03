import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@strait/ui/components/description-list";

export default function DescriptionListHorizontal() {
  return (
    <div className="max-w-lg">
      <DescriptionList divided orientation="horizontal">
        <DescriptionTerm>Invoice</DescriptionTerm>
        <DescriptionDetails>#INV-2025-0042</DescriptionDetails>
        <DescriptionTerm>Issued</DescriptionTerm>
        <DescriptionDetails>May 1, 2025</DescriptionDetails>
        <DescriptionTerm>Due</DescriptionTerm>
        <DescriptionDetails>May 31, 2025</DescriptionDetails>
        <DescriptionTerm>Amount</DescriptionTerm>
        <DescriptionDetails>$2,400.00</DescriptionDetails>
        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetails>Paid</DescriptionDetails>
      </DescriptionList>
    </div>
  );
}
