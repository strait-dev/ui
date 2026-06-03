"use client";

import { Tag, TagGroup, TagList } from "@strait/ui/components/tag-group";
import type React from "react";
import { useState } from "react";

const initial = ["Design", "React", "TypeScript", "Tailwind", "Next.js"];

export default function TagGroupRemovableDemo() {
  const [tags, setTags] = useState(initial);

  function handleRemove(keysToRemove: Set<React.Key>) {
    setTags((prev) => prev.filter((t) => !keysToRemove.has(t)));
  }

  return (
    <TagGroup label="Technologies (click × to remove)" onRemove={handleRemove}>
      <TagList>
        {tags.map((t) => (
          <Tag id={t} key={t} textValue={t}>
            {t}
          </Tag>
        ))}
      </TagList>
      {tags.length === 0 ? (
        <p className="mt-1 text-muted-foreground text-xs">All tags removed.</p>
      ) : null}
    </TagGroup>
  );
}
