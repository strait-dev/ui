import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "./credenza";

const meta: Meta<typeof Credenza> = {
  title: "Patterns/Credenza",
  component: Credenza,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A responsive dialog/drawer that renders as a **Dialog** on desktop (≥768 px) and as a **Drawer** (vaul) on mobile.",
          "",
          "Composition mirrors Radix Dialog/Vaul Drawer:",
          "- `Credenza` — root provider (detects viewport via `useMediaQuery`).",
          "- `CredenzaTrigger` — opens the overlay; accepts `render` prop for custom trigger elements.",
          "- `CredenzaContent` → `CredenzaHeader` + `CredenzaBody` + `CredenzaFooter`.",
          "- `CredenzaTitle`, `CredenzaDescription`, `CredenzaClose` map to the correct Dialog/Drawer sub-components.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — resize the viewport to see dialog vs. drawer. */
export const Playground: Story = {
  render: () => (
    <Credenza>
      <CredenzaTrigger
        render={<Button variant="outline">Open Credenza</Button>}
      />
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Responsive dialog</CredenzaTitle>
          <CredenzaDescription>
            On desktop this is a dialog; on mobile it becomes a bottom drawer.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <p className="text-sm">
            Resize the browser below 768 px to see the drawer behaviour. The
            component automatically switches between Dialog and Drawer without
            any prop changes.
          </p>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Confirm</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  ),
};

/** With a destructive confirm action. */
export const Destructive: Story = {
  render: () => (
    <Credenza>
      <CredenzaTrigger
        render={<Button variant="destructive">Delete account</Button>}
      />
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Delete account</CredenzaTitle>
          <CredenzaDescription>
            This action is permanent and cannot be undone. All your data will be
            deleted.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <p className="text-muted-foreground text-sm">
            Please confirm that you want to permanently delete your account and
            all associated data.
          </p>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive-solid">Delete</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  ),
};

/** With a form body. */
export const WithForm: Story = {
  render: () => (
    <Credenza>
      <CredenzaTrigger render={<Button>Edit profile</Button>} />
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Edit profile</CredenzaTitle>
          <CredenzaDescription>
            Update your display name and bio.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-sm" htmlFor="name-input">
                Name
              </label>
              <input
                className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                defaultValue="Leonardo Maldonado"
                id="name-input"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-sm" htmlFor="bio-input">
                Bio
              </label>
              <textarea
                className="min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                defaultValue="Software engineer and open-source contributor."
                id="bio-input"
              />
            </div>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <CredenzaClose render={<Button variant="outline">Discard</Button>} />
          <Button>Save changes</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  ),
};

/** No footer — information-only overlay. */
export const InfoOnly: Story = {
  render: () => (
    <Credenza>
      <CredenzaTrigger
        render={<Button variant="secondary">Learn more</Button>}
      />
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>About Credenza</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <p className="text-muted-foreground text-sm">
            Credenza automatically adapts to the user&apos;s viewport, rendering
            a centred dialog on larger screens and a bottom-anchored drawer on
            smaller ones — no extra configuration needed.
          </p>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  ),
};
