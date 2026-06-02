"use client";

import {
  InputWithInnerTags,
  type Tag,
} from "@strait/ui/components/input-with-inner-tags";
import { Label } from "@strait/ui/components/label";

const TAGS: Tag[] = [
  { id: "a", text: "Design" },
  { id: "b", text: "Engineering" },
  { id: "c", text: "Product" },
];

export default function InputWithInnerTagsDisabled() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inner-tags-disabled">Departments (read-only)</Label>
      <InputWithInnerTags
        disabled
        id="inner-tags-disabled"
        onTagsChange={() => undefined}
        tags={TAGS}
      />
    </div>
  );
}
