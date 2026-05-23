import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Button } from "./button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import {
  DetailSheet,
  DetailSheetRow,
  DetailSheetSection,
} from "./detail-sheet";

const meta: Meta<typeof DetailSheet> = {
  title: "Overlays/Detail Sheet",
  component: DetailSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A right-anchored inspection panel composed over the design-system `Sheet`.",
          "",
          "Provides a consistent header (`title` + optional muted `meta` subtitle),",
          "a scrollable body region, and an optional sticky footer — all driven by",
          "`Sheet` so animation, backdrop, and focus-trap behaviour are inherited.",
          "",
          "Compose the body with `DetailSheetSection` + `DetailSheetRow` for a uniform",
          "label/value layout. Use `side` to anchor from any screen edge.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

/**
 * Interactive playground — click the button to open the sheet, then explore
 * the Storybook controls to adjust props.
 */
export const Playground: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    const footer = (
      <div className="flex gap-2">
        <Button onClick={() => setOpen(false)} variant="brand-solid">
          Save changes
        </Button>
        <Button onClick={() => setOpen(false)} variant="outline">
          Discard
        </Button>
      </div>
    );

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          View deployment
        </Button>

        <DetailSheet
          footer={footer}
          meta="run-id: 0xDEADBEEF · 2 min ago"
          onOpenChange={setOpen}
          open={open}
          title="Deployment #d-42"
        >
          <DetailSheetSection heading="Summary">
            <DetailSheetRow label="Status">deployed</DetailSheetRow>
            <DetailSheetRow label="Environment">production</DetailSheetRow>
            <DetailSheetRow label="Region">us-east-1</DetailSheetRow>
            <DetailSheetRow label="Version">v1.4.2</DetailSheetRow>
          </DetailSheetSection>

          <DetailSheetSection heading="Timing">
            <DetailSheetRow label="Started">
              2024-01-15 09:32:04 UTC
            </DetailSheetRow>
            <DetailSheetRow label="Finished">
              2024-01-15 09:34:11 UTC
            </DetailSheetRow>
            <DetailSheetRow label="Duration">2m 7s</DetailSheetRow>
          </DetailSheetSection>

          <DetailSheetSection heading="Infrastructure">
            <DetailSheetRow label="Instance type">t3.medium</DetailSheetRow>
            <DetailSheetRow label="vCPU">2</DetailSheetRow>
            <DetailSheetRow label="Memory">4 GiB</DetailSheetRow>
            <DetailSheetRow label="Storage">20 GiB SSD</DetailSheetRow>
          </DetailSheetSection>
        </DetailSheet>
      </>
    );
  },
};

// ---------------------------------------------------------------------------
// CollapsiblePayload — demonstrates a collapsible raw-payload section
// ---------------------------------------------------------------------------

/**
 * Demonstrates embedding a collapsible raw-payload section inside a
 * `DetailSheet` body using the `Collapsible` component.
 *
 * The "Raw payload" block starts collapsed; clicking the toggle reveals the
 * full JSON so the panel stays compact by default while still being
 * inspectable.
 */
export const CollapsiblePayload: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [payloadOpen, setPayloadOpen] = React.useState(false);

    const rawPayload = JSON.stringify(
      {
        id: "d-42",
        status: "deployed",
        region: "us-east-1",
        version: "v1.4.2",
        build: { hash: "a1b2c3d4", duration: 127 },
        meta: { triggered_by: "ci/cd", ref: "main" },
      },
      null,
      2
    );

    const chevronIcon = payloadOpen ? ArrowUp01Icon : ArrowDown01Icon;

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Inspect with payload
        </Button>

        <DetailSheet
          meta="run-id: a1b2c3d4 · just now"
          onOpenChange={setOpen}
          open={open}
          title="Deployment #d-42"
        >
          <DetailSheetSection heading="Summary">
            <DetailSheetRow label="Status">deployed</DetailSheetRow>
            <DetailSheetRow label="Environment">production</DetailSheetRow>
            <DetailSheetRow label="Region">us-east-1</DetailSheetRow>
          </DetailSheetSection>

          <DetailSheetSection heading="Raw payload">
            <Collapsible onOpenChange={setPayloadOpen} open={payloadOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted/50 px-3 py-2 font-medium text-xs hover:bg-muted">
                <span>{payloadOpen ? "Hide payload" : "Show payload"}</span>
                <HugeiconsIcon icon={chevronIcon} size={14} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <pre className="mt-2 overflow-x-auto rounded-md bg-muted/30 p-3 font-mono text-xs leading-relaxed">
                  {rawPayload}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          </DetailSheetSection>
        </DetailSheet>
      </>
    );
  },
};
