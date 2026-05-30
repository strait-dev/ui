import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Label } from "./label";
import { Slider } from "./slider";

const meta = {
  title: "Forms/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A range slider built on the Base UI `Slider` primitive.",
          "",
          "Pass a single-element array as `defaultValue` for a single thumb,",
          "or a two-element array for a range slider (two thumbs). The component",
          "automatically renders the correct number of thumbs from the value array.",
          "",
          "Supports horizontal (default) and vertical orientation via the Base UI",
          "prop. The track fills from `min` to the thumb position.",
          "",
          "**Size** — `size` controls track thickness and thumb diameter:",
          "`sm` (thin/small), `default`, `lg` (thick/large).",
          "",
          "**Variant** — `variant` colors both the filled range and the thumb border/ring:",
          "`default` (primary), `success`, `warning`, `info`, `destructive`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    min: {
      control: { type: "number" },
      description: "Minimum value.",
      table: { defaultValue: { summary: "0" } },
    },
    max: {
      control: { type: "number" },
      description: "Maximum value.",
      table: { defaultValue: { summary: "100" } },
    },
    step: {
      control: { type: "number" },
      description: "Step increment.",
      table: { defaultValue: { summary: "1" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables the slider.",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Controls track thickness and thumb size.",
      table: { defaultValue: { summary: "default" } },
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "info", "destructive"],
      description: "Colors the filled range and thumb.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [40],
    size: "default",
    variant: "default",
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-72">
      <Slider aria-label="Value" {...args} />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Single thumb                                                        */
/* ------------------------------------------------------------------ */

function SingleThumbSlider() {
  const [val, setVal] = useState([60]);
  return (
    <div className="flex w-72 flex-col gap-3">
      <Label>Volume: {val[0]}</Label>
      <Slider
        aria-label="Volume"
        defaultValue={val}
        max={100}
        min={0}
        onValueChange={(v) => setVal(v as number[])}
      />
    </div>
  );
}

/** Single-thumb slider with live value display. */
export const SingleThumb: Story = {
  render: () => <SingleThumbSlider />,
};

/* ------------------------------------------------------------------ */
/* Range (two thumbs)                                                  */
/* ------------------------------------------------------------------ */

function RangeSlider() {
  const [range, setRange] = useState([20, 80]);
  return (
    <div className="flex w-72 flex-col gap-3">
      <Label>
        Price range: ${range[0]} – ${range[1]}
      </Label>
      <Slider
        aria-label="Price range"
        defaultValue={range}
        max={200}
        min={0}
        onValueChange={(v) => setRange(v as number[])}
        step={5}
      />
    </div>
  );
}

/** Two-thumb range slider — pass a two-element `defaultValue`. */
export const Range: Story = {
  render: () => <RangeSlider />,
};

/* ------------------------------------------------------------------ */
/* Sizes                                                               */
/* ------------------------------------------------------------------ */

/** Three track and thumb sizes. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div className="flex flex-col gap-2" key={size}>
          <Label>{size}</Label>
          <Slider {...args} aria-label={`Volume ${size}`} size={size} />
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */

/** Five variant colours — filled range and thumb ring. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-6">
      {(["default", "success", "warning", "info", "destructive"] as const).map(
        (variant) => (
          <div className="flex flex-col gap-2" key={variant}>
            <Label>{variant}</Label>
            <Slider
              {...args}
              aria-label={`Volume ${variant}`}
              defaultValue={[60]}
              variant={variant}
            />
          </div>
        )
      )}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Disabled                                                            */
/* ------------------------------------------------------------------ */

/** Disabled state — thumb is not interactive. */
export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <Slider
        aria-label="Disabled slider"
        defaultValue={[50]}
        disabled
        max={100}
        min={0}
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

/** A slider that snaps to whole-number steps of 10. */
export const Stepped: Story = {
  render: () => {
    const [val, setVal] = useState([30]);
    return (
      <div className="flex w-72 flex-col gap-3">
        <Label>Rating: {val[0]} / 100 (step 10)</Label>
        <Slider
          aria-label="Rating"
          defaultValue={val}
          max={100}
          min={0}
          onValueChange={(v) => setVal(v as number[])}
          step={10}
        />
      </div>
    );
  },
};

/* ------------------------------------------------------------------ */
/* Vertical                                                            */
/* ------------------------------------------------------------------ */

/** Vertical orientation — set `orientation="vertical"` and give the container height. */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-48 items-center gap-8">
      <div className="flex h-full flex-col items-center gap-2">
        <Slider
          aria-label="Volume"
          defaultValue={[60]}
          max={100}
          min={0}
          orientation="vertical"
        />
        <Label>Volume</Label>
      </div>
      <div className="flex h-full flex-col items-center gap-2">
        <Slider
          aria-label="Range"
          defaultValue={[30, 70]}
          max={100}
          min={0}
          orientation="vertical"
        />
        <Label>Range</Label>
      </div>
    </div>
  ),
};
