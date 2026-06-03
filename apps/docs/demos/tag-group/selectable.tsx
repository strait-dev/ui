"use client";

import { Tag, TagGroup, TagList } from "@strait/ui/components/tag-group";
import { useState } from "react";

const skills = ["React", "TypeScript", "Tailwind", "Next.js", "Node.js"];

export default function TagGroupSelectableDemo() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <TagGroup
      label="Select your skills (multiple)"
      onSelectionChange={(keys) => setSelected(keys as Set<string>)}
      selectedKeys={selected}
      selectionMode="multiple"
    >
      <TagList>
        {skills.map((s) => (
          <Tag id={s} key={s} textValue={s} variant="outline">
            {s}
          </Tag>
        ))}
      </TagList>
    </TagGroup>
  );
}
