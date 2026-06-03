import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@strait/ui/components/table";

const invoices = [
  { id: "INV-001", client: "Acme Corp", amount: "$1,200", date: "Jun 1" },
  { id: "INV-002", client: "Globex", amount: "$3,400", date: "Jun 5" },
  { id: "INV-003", client: "Initech", amount: "$780", date: "Jun 9" },
  { id: "INV-004", client: "Umbrella", amount: "$5,000", date: "Jun 12" },
  { id: "INV-005", client: "Hooli", amount: "$2,150", date: "Jun 15" },
];

export default function TableStriped() {
  return (
    <Table variant="striped">
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="font-mono text-xs">{inv.id}</TableCell>
            <TableCell>{inv.client}</TableCell>
            <TableCell className="text-muted-foreground">{inv.date}</TableCell>
            <TableCell className="font-medium">{inv.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
