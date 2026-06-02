"use client";

import {
  InputWithInnerTags,
  type Tag,
} from "@strait/ui/components/input-with-inner-tags";
import { Label } from "@strait/ui/components/label";
import { useState } from "react";

export default function InputWithInnerTagsEmpty() {
  const [tags, setTags] = useState<Tag[]>([]);

  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inner-tags-empty">Labels</Label>
      <InputWithInnerTags
        id="inner-tags-empty"
        onTagsChange={setTags}
        placeholder="Type and press Enter…"
        tags={tags}
      />
    </div>
  );
}
