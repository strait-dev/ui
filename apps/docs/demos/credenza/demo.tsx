import { Button } from "@strait/ui/components/button";
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
} from "@strait/ui/components/credenza";

export default function CredenzaDemo() {
  return (
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
  );
}
