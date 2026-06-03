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

export default function CredenzaDestructive() {
  return (
    <Credenza>
      <CredenzaTrigger
        render={<Button variant="destructive-solid">Delete account</Button>}
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
  );
}
