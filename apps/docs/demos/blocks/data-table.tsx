import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@strait/ui/components/avatar";
import { Badge } from "@strait/ui/components/badge";
import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@strait/ui/components/table";

const orders = [
  {
    id: "ORD-001",
    customer: {
      name: "Alice Martin",
      initials: "AM",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    product: "Pro Plan",
    amount: "$149.00",
    status: "Paid",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Bob Chen",
      initials: "BC",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    product: "Starter Plan",
    amount: "$49.00",
    status: "Pending",
  },
  {
    id: "ORD-003",
    customer: {
      name: "Carol Singh",
      initials: "CS",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    product: "Enterprise",
    amount: "$499.00",
    status: "Paid",
  },
  {
    id: "ORD-004",
    customer: { name: "Daniel Rivera", initials: "DR", avatar: "" },
    product: "Pro Plan",
    amount: "$149.00",
    status: "Refunded",
  },
  {
    id: "ORD-005",
    customer: {
      name: "Eva Kim",
      initials: "EK",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    product: "Starter Plan",
    amount: "$49.00",
    status: "Paid",
  },
];

function statusVariant(status: string) {
  if (status === "Paid") {
    return "success-light" as const;
  }
  if (status === "Pending") {
    return "warning-light" as const;
  }
  return "destructive-light" as const;
}

export default function DataTableBlock() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Orders</CardTitle>
        <Button size="sm" variant="outline">
          <HugeiconsIcon data-icon="inline-start" icon={Download01Icon} />
          Export
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table size="lg">
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      {order.customer.avatar ? (
                        <AvatarImage
                          alt={order.customer.name}
                          src={order.customer.avatar}
                        />
                      ) : null}
                      <AvatarFallback>{order.customer.initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{order.customer.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {order.product}
                </TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
