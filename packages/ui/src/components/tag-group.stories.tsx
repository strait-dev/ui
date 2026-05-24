import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Tag, TagGroup, TagList } from "./tag-group";

const meta: Meta<typeof TagGroup> = {
  title: "Data Display/Tag Group",
  component: TagGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "An accessible group of tags built on **React Aria Components** `TagGroup`.",
          "",
          "Supports single and multiple selection, keyboard navigation, and",
          "removable tags. Three visual variants are available: `default`,",
          "`secondary`, and `outline`.",
          "",
          "Compose `TagGroup` → `TagList` → `Tag` to build any tag UI.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Optional label rendered above the tag list.",
    },
    selectionMode: {
      control: "select",
      options: ["none", "single", "multiple"],
      description: "Selection behaviour for the group.",
      table: { defaultValue: { summary: "none" } },
    },
  },
  args: {
    label: "Tags",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Playground                                                          */
/* ------------------------------------------------------------------ */

/** Interactive playground — adjust props in the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <TagGroup {...args}>
      <TagList>
        {["Design", "React", "TypeScript", "UI"].map((t) => (
          <Tag id={t} key={t} textValue={t}>
            {t}
          </Tag>
        ))}
      </TagList>
    </TagGroup>
  ),
};

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */

/** All three visual variants side-by-side. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-medium text-muted-foreground text-xs">
          Default
        </span>
        <TagGroup>
          <TagList>
            {["Design", "React", "TypeScript"].map((t) => (
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
            {["Design", "React", "TypeScript"].map((t) => (
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
            {["Design", "React", "TypeScript"].map((t) => (
              <Tag id={t} key={t} textValue={t} variant="outline">
                {t}
              </Tag>
            ))}
          </TagList>
        </TagGroup>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Selectable                                                          */
/* ------------------------------------------------------------------ */

/** Single and multiple selection modes with controlled state. */
export const Selectable: Story = {
  render: () => {
    const skills = ["React", "TypeScript", "Tailwind", "Next.js", "Node.js"];

    const [single, setSingle] = useState<Set<string>>(new Set());
    const [multi, setMulti] = useState<Set<string>>(new Set());

    return (
      <div className="flex flex-col gap-8">
        <TagGroup
          label="Single select — pick one"
          onSelectionChange={(keys) => setSingle(keys as Set<string>)}
          selectedKeys={single}
          selectionMode="single"
        >
          <TagList>
            {skills.map((s) => (
              <Tag id={s} key={s} textValue={s}>
                {s}
              </Tag>
            ))}
          </TagList>
        </TagGroup>

        <TagGroup
          label="Multiple select — pick many"
          onSelectionChange={(keys) => setMulti(keys as Set<string>)}
          selectedKeys={multi}
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
      </div>
    );
  },
};

/* ------------------------------------------------------------------ */
/* Removable                                                           */
/* ------------------------------------------------------------------ */

/** Tags can be removed — clicking × (or pressing Backspace/Delete) calls `onRemove`. */
export const Removable: Story = {
  render: () => {
    const initial = [
      "Design",
      "React",
      "TypeScript",
      "UI",
      "Tailwind",
      "Next.js",
    ];
    const [tags, setTags] = useState(initial);

    function handleRemove(keysToRemove: Set<React.Key>) {
      setTags((prev) => prev.filter((t) => !keysToRemove.has(t)));
    }

    return (
      <TagGroup
        label="Technologies (click × to remove)"
        onRemove={handleRemove}
      >
        <TagList>
          {tags.map((t) => (
            <Tag id={t} key={t} textValue={t}>
              {t}
            </Tag>
          ))}
        </TagList>
        {tags.length === 0 ? (
          <p className="mt-1 text-muted-foreground text-xs">
            All tags removed.
          </p>
        ) : null}
      </TagGroup>
    );
  },
};

/* ------------------------------------------------------------------ */
/* Disabled                                                            */
/* ------------------------------------------------------------------ */

/** Individual tags can be disabled via `disabledKeys` on the group. */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <TagGroup
        disabledKeys={["typescript", "nodejs"]}
        label="With disabled tags"
        selectionMode="multiple"
      >
        <TagList>
          {[
            { id: "react", label: "React" },
            { id: "typescript", label: "TypeScript" },
            { id: "tailwind", label: "Tailwind" },
            { id: "nodejs", label: "Node.js" },
          ].map(({ id, label }) => (
            <Tag id={id} key={id} textValue={label}>
              {label}
            </Tag>
          ))}
        </TagList>
      </TagGroup>

      <TagGroup
        disabledKeys={["Design", "React", "TypeScript"]}
        label="Fully disabled group"
      >
        <TagList>
          {["Design", "React", "TypeScript"].map((t) => (
            <Tag id={t} key={t} textValue={t} variant="outline">
              {t}
            </Tag>
          ))}
        </TagList>
      </TagGroup>
    </div>
  ),
};
