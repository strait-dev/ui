import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@strait/ui/components/description-list";

export default function DescriptionListVertical() {
  return (
    <div className="max-w-sm">
      <DescriptionList>
        <DescriptionTerm>Full name</DescriptionTerm>
        <DescriptionDetails>Alice Martin</DescriptionDetails>
        <DescriptionTerm>Email</DescriptionTerm>
        <DescriptionDetails>alice@example.com</DescriptionDetails>
        <DescriptionTerm>Department</DescriptionTerm>
        <DescriptionDetails>Engineering — Platform</DescriptionDetails>
        <DescriptionTerm>Location</DescriptionTerm>
        <DescriptionDetails>San Francisco, CA</DescriptionDetails>
      </DescriptionList>
    </div>
  );
}
