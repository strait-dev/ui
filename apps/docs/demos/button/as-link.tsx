import { Button } from "@strait/ui/components/button";

export default function ButtonAsLink() {
  return (
    <Button render={<a href="/docs">Read the docs</a>} variant="brand-solid" />
  );
}
