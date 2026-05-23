import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta: Meta<typeof Table> = {
  title: "Data Display/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Semantic HTML table primitives: `Table`, `TableHeader`, `TableBody`,",
          "`TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`.",
          "",
          "The outer `Table` wraps itself in a horizontally-scrollable `<div>`",
          "so wide tables stay accessible on small viewports.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

type Invoice = {
  id: string;
  status: "Paid" | "Pending" | "Failed";
  method: string;
  amount: number;
};

const invoices: Invoice[] = [
  { id: "INV-001", status: "Paid", method: "Credit card", amount: 250.0 },
  { id: "INV-002", status: "Pending", method: "Bank transfer", amount: 150.0 },
  { id: "INV-003", status: "Failed", method: "PayPal", amount: 350.0 },
  { id: "INV-004", status: "Paid", method: "Credit card", amount: 450.0 },
  { id: "INV-005", status: "Pending", method: "Bank transfer", amount: 550.0 },
];

const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);

const statusVariantMap = {
  Paid: "success-light",
  Pending: "warning-light",
  Failed: "destructive-light",
} as const;

/** Default table with header, body, footer, and a caption. */
export const Playground: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="font-medium">{inv.id}</TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[inv.status]}>{inv.status}</Badge>
            </TableCell>
            <TableCell>{inv.method}</TableCell>
            <TableCell className="text-right">
              ${inv.amount.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            ${totalAmount.toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

/** Table without footer or caption — the minimal composition. */
export const Minimal: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { name: "Alice Martin", role: "Engineer", dept: "Product" },
          { name: "Bob Chen", role: "Designer", dept: "Design" },
          { name: "Carol Singh", role: "Manager", dept: "Operations" },
          { name: "Dave Lee", role: "Analyst", dept: "Finance" },
        ].map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-medium">{row.name}</TableCell>
            <TableCell>{row.role}</TableCell>
            <TableCell>{row.dept}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** A selected row uses `data-state="selected"` to apply the highlight style. */
export const WithSelectedRow: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv, i) => (
          <TableRow data-state={i === 1 ? "selected" : undefined} key={inv.id}>
            <TableCell className="font-medium">{inv.id}</TableCell>
            <TableCell>
              <Badge variant={statusVariantMap[inv.status]}>{inv.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              ${inv.amount.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Caption appears below the table by default (`caption-bottom`). */
export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>Transactions from the last 30 days.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.slice(0, 3).map((inv) => (
          <TableRow key={inv.id}>
            <TableCell>{inv.id}</TableCell>
            <TableCell>{inv.method}</TableCell>
            <TableCell className="text-right">
              ${inv.amount.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Wide column set — wrapping `Table` automatically enables horizontal scroll. */
export const WideScrollable: Story = {
  render: () => (
    <div className="max-w-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {["ID", "Status", "Method", "Created", "Updated", "Amount"].map(
              (h) => (
                <TableHead key={h}>{h}</TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell>{inv.id}</TableCell>
              <TableCell>{inv.status}</TableCell>
              <TableCell>{inv.method}</TableCell>
              <TableCell>2025-01-10</TableCell>
              <TableCell>2025-01-15</TableCell>
              <TableCell>${inv.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
