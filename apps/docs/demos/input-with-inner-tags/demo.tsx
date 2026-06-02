"use client";

import {
  InputWithInnerTags,
  type Tag,
} from "@strait/ui/components/input-with-inner-tags";
import { Label } from "@strait/ui/components/label";
import { useState } from "react";

export default function InputWithInnerTagsDemo() {
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", text: "React" },
    { id: "2", text: "TypeScript" },
  ]);

  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inner-tags-demo">Technologies</Label>
      <InputWithInnerTags
        id="inner-tags-demo"
        onTagsChange={setTags}
        placeholder="Add a tag"
        tags={tags}
      />
    </div>
  );
}
