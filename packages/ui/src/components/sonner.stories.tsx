"use client";

import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
  MultiplicationSignCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";

import { Button } from "./button";
import { Toaster } from "./sonner";

const meta = {
  title: "Feedback/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "The `Toaster` component (re-exported from [sonner](https://sonner.emilkowal.ski/))",
          "mounts a portal that renders toast notifications. Call the imperative",
          "`toast.*` API from anywhere to trigger toasts.",
          "",
          "Mount **one** `<Toaster />` near the root of the app. The stories below",
          "show buttons that fire different toast types.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Fire success, error, info, warning, loading, and promise toasts. */
export const Playground: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          onClick={() =>
            toast.success("Saved!", {
              description: "Your changes have been published.",
            })
          }
          variant="success"
        >
          <HugeiconsIcon
            data-icon="inline-start"
            icon={CheckmarkCircle02Icon}
          />
          Success
        </Button>

        <Button
          onClick={() =>
            toast.error("Something went wrong", {
              description: "Please try again later.",
            })
          }
          variant="destructive"
        >
          <HugeiconsIcon
            data-icon="inline-start"
            icon={MultiplicationSignCircleIcon}
          />
          Error
        </Button>

        <Button
          onClick={() =>
            toast.info("New update available", {
              description: "Refresh the page to get the latest version.",
            })
          }
          variant="info"
        >
          <HugeiconsIcon
            data-icon="inline-start"
            icon={InformationCircleIcon}
          />
          Info
        </Button>

        <Button
          onClick={() =>
            toast.warning("Low disk space", {
              description: "Less than 500 MB remaining.",
            })
          }
          variant="warning"
        >
          <HugeiconsIcon data-icon="inline-start" icon={Alert02Icon} />
          Warning
        </Button>

        <Button
          onClick={() =>
            toast.loading("Uploading…", {
              description: "Please wait while we process your file.",
            })
          }
          variant="secondary"
        >
          <HugeiconsIcon
            className="animate-spin"
            data-icon="inline-start"
            icon={Loading03Icon}
          />
          Loading
        </Button>
      </div>
    </>
  ),
};

/** Success toast variants — with and without description. */
export const Success: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => toast.success("Profile updated")}
          variant="success"
        >
          Without description
        </Button>
        <Button
          onClick={() =>
            toast.success("File uploaded", {
              description: "avatar.png was uploaded successfully.",
            })
          }
          variant="success"
        >
          With description
        </Button>
        <Button
          onClick={() =>
            toast.success("Saved", {
              description: "Your changes are live.",
              action: {
                label: "View",
                onClick: () => {},
              },
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

/** Error toast variants. */
export const ErrorToasts: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => toast.error("Upload failed")}
          variant="destructive"
        >
          Without description
        </Button>
        <Button
          onClick={() =>
            toast.error("Connection error", {
              description: "Could not reach the server. Check your network.",
            })
          }
          variant="destructive"
        >
          With description
        </Button>
        <Button
          onClick={() =>
            toast.error("Save failed", {
              description: "There was an error saving your changes.",
              action: {
                label: "Retry",
                onClick: () => {},
              },
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

/** Info and warning toasts. */
export const InfoAndWarning: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() =>
            toast.info("Maintenance at 2 AM UTC", {
              description: "The service will be unavailable for ~30 minutes.",
            })
          }
          variant="info"
        >
          Info
        </Button>
        <Button
          onClick={() =>
            toast.warning("Session expiring soon", {
              description: "You will be logged out in 5 minutes.",
              action: {
                label: "Stay signed in",
                onClick: () => {},
              },
            })
          }
          variant="warning"
        >
          Warning with action
        </Button>
      </div>
    </>
  ),
};

/** Promise toast — shows a loading state then resolves to success or error. */
export const WithPromise: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => {
            const promise = new Promise<{ name: string }>((resolve) =>
              setTimeout(() => resolve({ name: "report.pdf" }), 2000),
            );
            toast.promise(promise, {
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
            const promise = new Promise<void>((_, reject) =>
              setTimeout(() => reject(new Error("Network error")), 2000),
            );
            toast.promise(promise, {
              loading: "Deleting…",
              success: "Deleted",
              error: "Could not delete. Please try again.",
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
