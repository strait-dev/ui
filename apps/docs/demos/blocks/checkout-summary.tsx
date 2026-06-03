import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";
import { InputWithInlineButton } from "@strait/ui/components/input-with-inline-button";
import { Separator } from "@strait/ui/components/separator";

const lineItems = [
  { name: "Pro plan (annual)", price: "$288.00" },
  { name: "Extra seat", price: "$96.00" },
  { name: "Add-on: Analytics", price: "$48.00" },
];

export default function CheckoutSummaryBlock() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Order summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {lineItems.map((item) => (
            <div
              className="flex items-center justify-between gap-4"
              key={item.name}
            >
              <span className="text-sm">{item.name}</span>
              <span className="text-sm tabular-nums">{item.price}</span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground text-sm">Subtotal</span>
            <span className="text-sm tabular-nums">$432.00</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground text-sm">Tax (8%)</span>
            <span className="text-sm tabular-nums">$34.56</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-sm">Total</span>
            <span className="font-semibold text-sm tabular-nums">$466.56</span>
          </div>
        </div>
        <Separator />
        <InputWithInlineButton
          buttonText="Apply"
          buttonType="button"
          placeholder="Promo code"
          type="text"
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="brand-solid">
          Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
