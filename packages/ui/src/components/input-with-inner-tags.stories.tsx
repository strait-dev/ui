"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { InputWithInnerTags, type Tag } from "./input-with-inner-tags";
import { Label } from "./label";

const meta: Meta<typeof InputWithInnerTags> = {
  title: "Patterns/Input with Inner Tags",
  component: InputWithInnerTags,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A tag / multi-value input that renders typed entries as removable `Badge` chips",
          "inside the field boundary.",
          "",
          "Composes `Input`, `Badge`, and `Button` primitives. Tags are added on Enter or",
          "by clicking the inline add-button; the last tag can be deleted with Backspace.",
          "",
          "This is a **controlled** component — manage `tags` + `onTagsChange` in the",
          "parent. Duplicate values are silently ignored.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder shown when no tags are present.",
    },
    disabled: {
      control: "boolean",
      description: "Disable tag entry and removal.",
    },
    tags: {
      control: false,
      description: "Controlled array of current tags.",
    },
    onTagsChange: {
      control: false,
      description: "Called with the next tag array on add or remove.",
    },
  },
  args: {
    placeholder: "Add a tag",
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function TagsWrapper({
  placeholder,
  disabled,
}: {
  placeholder?: string;
  disabled?: boolean;
}) {
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", text: "React" },
    { id: "2", text: "TypeScript" },
  ]);

  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inner-tags-playground">Technologies</Label>
      <InputWithInnerTags
        disabled={disabled}
        id="inner-tags-playground"
        onTagsChange={setTags}
        placeholder={placeholder}
        tags={tags}
      />
    </div>
  );
}

/** Interactive playground — type and press Enter to add tags; click × to remove. */
export const Playground: Story = {
  render: (args) => (
    <TagsWrapper disabled={args.disabled} placeholder={args.placeholder} />
  ),
};

/** Starts empty — shows the placeholder and how the first tags appear. */
export const Empty: Story = {
  render: () => {
    function EmptyWrapper() {
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
    return <EmptyWrapper />;
  },
};

/** Pre-filled with several tags demonstrating wrapping behaviour. */
export const WithManyTags: Story = {
  render: () => {
    function ManyTagsWrapper() {
      const initialTags: Tag[] = [
        { id: "a", text: "React" },
        { id: "b", text: "TypeScript" },
        { id: "c", text: "Tailwind" },
        { id: "d", text: "Storybook" },
        { id: "e", text: "Vite" },
      ];
      const [tags, setTags] = useState<Tag[]>(initialTags);
      return (
        <div className="flex w-72 flex-col gap-1.5">
          <Label htmlFor="inner-tags-many">Stack</Label>
          <InputWithInnerTags
            id="inner-tags-many"
            onTagsChange={setTags}
            placeholder="Add more…"
            tags={tags}
          />
        </div>
      );
    }
    return <ManyTagsWrapper />;
  },
};

/** Disabled — existing tags are visible but none can be added or removed. */
export const Disabled: Story = {
  render: () => {
    const tags: Tag[] = [
      { id: "x", text: "Design" },
      { id: "y", text: "Engineering" },
    ];
    return (
      <div className="flex w-72 flex-col gap-1.5">
        <Label htmlFor="inner-tags-disabled">Departments (read-only)</Label>
        <InputWithInnerTags
          disabled
          id="inner-tags-disabled"
          onTagsChange={() => {}}
          tags={tags}
        />
      </div>
    );
  },
};
