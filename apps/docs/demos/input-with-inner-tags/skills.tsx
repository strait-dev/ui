"use client";

import {
  InputWithInnerTags,
  type Tag,
} from "@strait/ui/components/input-with-inner-tags";
import { Label } from "@strait/ui/components/label";
import { useState } from "react";

export default function InputWithInnerTagsSkills() {
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", text: "React" },
    { id: "2", text: "TypeScript" },
    { id: "3", text: "Tailwind" },
  ]);

  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inner-tags-skills">Skills</Label>
      <InputWithInnerTags
        id="inner-tags-skills"
        onTagsChange={setTags}
        placeholder="Add a skill…"
        tags={tags}
      />
    </div>
  );
}
