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

export default function CredenzaWithForm() {
  return (
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
              <label className="font-medium text-sm" htmlFor="cred-name">
                Name
              </label>
              <input
                className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                defaultValue="Leonardo Maldonado"
                id="cred-name"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-sm" htmlFor="cred-bio">
                Bio
              </label>
              <textarea
                className="min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                defaultValue="Software engineer and open-source contributor."
                id="cred-bio"
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
  );
}
