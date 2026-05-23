"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../button";
import { toast } from "./toast";
import { Toaster } from "./toaster";

const meta = {
  title: "Feedback/Toast",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Toasts built on [sonner](https://sonner.emilkowal.ski/), rendered with",
          "Sonner's **built-in styled toasts** themed by the design-system tokens.",
          "Mount **one** `<Toaster />` near your app root, then call the imperative",
          "`toast` API anywhere:",
          "",
          "```ts",
          'import { toast } from "@strait/ui/toast";',
          "",
          'toast.success("File saved");',
          'toast.error("Upload failed", { description: "Check your network." });',
          'toast.warning("Low disk space", { action: { label: "Clean up", onClick: fn } });',
          'toast.info("Update available");',
          'toast.loading("Processing…");',
          'toast.confirm("Delete this item?", { onConfirm: () => remove() });',
          "```",
          "",
          "All types except `loading` and `confirm` accept an optional `action`",
          "(`{ label, onClick }`) that renders an inline action button. `confirm`",
          "renders native `confirm`/`cancel` buttons.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Fire every toast type from a single panel. */
export const Playground: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={() =>
            toast.success("Changes saved", {
              description: "Your project has been published.",
            })
          }
          variant="success"
        >
          Success
        </Button>

        <Button
          onClick={() =>
            toast.error("Upload failed", {
              description: "The file exceeds the 50 MB limit.",
            })
          }
          variant="destructive"
        >
          Error
        </Button>

        <Button
          onClick={() =>
            toast.warning("Session expiring", {
              description: "You will be logged out in 5 minutes.",
              action: { label: "Stay signed in", onClick: () => {} },
            })
          }
          variant="warning"
        >
          Warning
        </Button>

        <Button
          onClick={() =>
            toast.info("Maintenance window", {
              description: "Scheduled downtime at 2 AM UTC.",
            })
          }
          variant="info"
        >
          Info
        </Button>

        <Button
          onClick={() =>
            toast.loading("Uploading file…", {
              description: "Please wait.",
            })
          }
          variant="secondary"
        >
          Loading
        </Button>

        <Button
          onClick={() =>
            toast.confirm("Delete this project?", {
              description: "This action cannot be undone.",
              confirmLabel: "Delete",
              cancelLabel: "Cancel",
              onConfirm: () => {
                toast.success("Project deleted");
              },
            })
          }
          variant="destructive-outline"
        >
          Confirm
        </Button>
      </div>
    </>
  ),
};

/** Success toasts — plain, with description, with an action. */
export const SuccessToasts: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => toast.success("Profile updated")}
          variant="success"
        >
          Plain
        </Button>
        <Button
          onClick={() =>
            toast.success("File uploaded", {
              description: "avatar.png (2.4 MB) was saved.",
            })
          }
          variant="success"
        >
          With description
        </Button>
        <Button
          onClick={() =>
            toast.success("Deployed to production", {
              description: "v1.4.2 is now live.",
              action: { label: "View", onClick: () => {} },
            })
          }
          variant="success"
        >
          With action
        </Button>
      </div>
    </>
  ),
};

/** Error toasts — plain, with description, with a retry action. */
export const ErrorToasts: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => toast.error("Something went wrong")}
          variant="destructive"
        >
          Plain
        </Button>
        <Button
          onClick={() =>
            toast.error("Connection lost", {
              description: "Check your internet and try again.",
            })
          }
          variant="destructive"
        >
          With description
        </Button>
        <Button
          onClick={() =>
            toast.error("Save failed", {
              description: "We could not save your changes.",
              action: { label: "Retry", onClick: () => {} },
            })
          }
          variant="destructive"
        >
          With action
        </Button>
      </div>
    </>
  ),
};

/** Warning and info toasts. */
export const WarningAndInfo: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() =>
            toast.warning("Low disk space", {
              description: "Less than 500 MB remaining.",
              action: { label: "Clean up", onClick: () => {} },
            })
          }
          variant="warning"
        >
          Warning
        </Button>
        <Button
          onClick={() =>
            toast.info("New version available", {
              description: "Refresh to get v2.0.",
              action: {
                label: "Refresh",
                onClick: () => window.location.reload(),
              },
            })
          }
          variant="info"
        >
          Info
        </Button>
      </div>
    </>
  ),
};

/** Confirm toast — native confirm/cancel buttons. */
export const ConfirmToast: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() =>
            toast.confirm("Delete this file?", {
              description: "This cannot be undone.",
              confirmLabel: "Delete",
              cancelLabel: "Cancel",
              onConfirm: () => {
                toast.success("File deleted");
              },
              onCancel: () => {
                toast.info("Cancelled");
              },
            })
          }
          variant="destructive-outline"
        >
          Delete file
        </Button>

        <Button
          onClick={() =>
            toast.confirm("Archive this project?", {
              confirmLabel: "Archive",
              onConfirm: async () => {
                await new Promise((r) => setTimeout(r, 300));
                toast.success("Project archived");
              },
            })
          }
          variant="outline"
        >
          Archive project
        </Button>
      </div>
    </>
  ),
};

/** Promise toast — loading → success or loading → error. */
export const PromiseToast: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => {
            const p = new Promise<{ name: string }>((resolve) =>
              setTimeout(() => resolve({ name: "report.pdf" }), 2000)
            );
            toast.promise(p, {
              loading: "Uploading file…",
              success: (data) => `${data.name} uploaded successfully`,
              error: "Upload failed",
            });
          }}
          variant="outline"
        >
          Promise (resolves)
        </Button>

        <Button
          onClick={() => {
            const p = new Promise<void>((_, reject) =>
              setTimeout(() => reject(new Error("Network error")), 2000)
            );
            toast.promise(p, {
              loading: "Saving…",
              success: "Saved",
              error: "Could not save. Please try again.",
            });
          }}
          variant="outline"
        >
          Promise (rejects)
        </Button>
      </div>
    </>
  ),
};
