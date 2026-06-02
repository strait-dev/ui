import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import { ButtonGroup } from "@strait/ui/components/button-group";

export default function ButtonGroupVertical() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">
        <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
        New
      </Button>
      <Button variant="outline">Duplicate</Button>
      <Button variant="outline">Archive</Button>
    </ButtonGroup>
  );
}
