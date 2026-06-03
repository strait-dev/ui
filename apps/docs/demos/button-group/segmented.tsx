import { Button } from "@strait/ui/components/button";
import { ButtonGroup } from "@strait/ui/components/button-group";

export default function ButtonGroupSegmented() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup>
        <Button variant="outline">Day</Button>
        <Button variant="outline">Week</Button>
        <Button variant="outline">Month</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Table</Button>
        <Button variant="outline">Board</Button>
        <Button variant="outline">Calendar</Button>
      </ButtonGroup>
    </div>
  );
}
