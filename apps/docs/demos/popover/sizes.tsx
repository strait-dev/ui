import { Button } from "@strait/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@strait/ui/components/popover";

export default function PopoverSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Popover>
        <PopoverTrigger render={<Button variant="outline">Compact</Button>} />
        <PopoverContent size="sm">
          <PopoverHeader>
            <PopoverTitle>Compact popover</PopoverTitle>
            <PopoverDescription>
              Tighter padding and smaller text for dense UI contexts.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="outline">Default</Button>} />
        <PopoverContent size="default">
          <PopoverHeader>
            <PopoverTitle>Default popover</PopoverTitle>
            <PopoverDescription>
              Standard padding and text size for most use cases.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger render={<Button variant="outline">Large</Button>} />
        <PopoverContent size="lg">
          <PopoverHeader>
            <PopoverTitle>Large popover</PopoverTitle>
            <PopoverDescription>
              More generous padding for rich interactive content like forms or
              filters.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  );
}
