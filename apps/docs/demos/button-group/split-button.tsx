import { ArrowDown01Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@strait/ui/components/button-group";

export default function ButtonGroupSplitButton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup>
        <Button variant="outline">Save</Button>
        <ButtonGroupSeparator />
        <Button aria-label="More save options" size="icon" variant="outline">
          <HugeiconsIcon icon={ArrowDown01Icon} />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText>strait.dev/p/</ButtonGroupText>
        <Button aria-label="Copy link" size="icon" variant="outline">
          <HugeiconsIcon icon={Copy01Icon} />
        </Button>
      </ButtonGroup>
    </div>
  );
}
