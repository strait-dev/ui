import { Tag, TagGroup, TagList } from "@strait/ui/components/tag-group";

const tags = ["Design", "React", "TypeScript", "Accessibility", "UI"];

export default function TagGroupDemo() {
  return (
    <div className="flex flex-col gap-4">
      <TagGroup label="Technologies" selectionMode="multiple">
        <TagList>
          {tags.map((t) => (
            <Tag id={t} key={t} textValue={t}>
              {t}
            </Tag>
          ))}
        </TagList>
      </TagGroup>

      <TagGroup label="Outline variant">
        <TagList>
          {["Tailwind", "Base UI", "Radix"].map((t) => (
            <Tag id={t} key={t} textValue={t} variant="outline">
              {t}
            </Tag>
          ))}
        </TagList>
      </TagGroup>
    </div>
  );
}
