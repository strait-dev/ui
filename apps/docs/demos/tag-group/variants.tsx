import { Tag, TagGroup, TagList } from "@strait/ui/components/tag-group";

const tags = ["Design", "React", "TypeScript", "Tailwind"];

export default function TagGroupVariantsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-medium text-muted-foreground text-xs">
          Default
        </span>
        <TagGroup>
          <TagList>
            {tags.map((t) => (
              <Tag id={t} key={t} textValue={t} variant="default">
                {t}
              </Tag>
            ))}
          </TagList>
        </TagGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-medium text-muted-foreground text-xs">
          Secondary
        </span>
        <TagGroup>
          <TagList>
            {tags.map((t) => (
              <Tag id={t} key={t} textValue={t} variant="secondary">
                {t}
              </Tag>
            ))}
          </TagList>
        </TagGroup>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-medium text-muted-foreground text-xs">
          Outline
        </span>
        <TagGroup>
          <TagList>
            {tags.map((t) => (
              <Tag id={t} key={t} textValue={t} variant="outline">
                {t}
              </Tag>
            ))}
          </TagList>
        </TagGroup>
      </div>
    </div>
  );
}
