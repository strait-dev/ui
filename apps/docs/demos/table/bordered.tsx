import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@strait/ui/components/table";

const expenses = [
  { category: "Design", q1: "$4,200", q2: "$3,800", q3: "$5,100" },
  { category: "Engineering", q1: "$18,000", q2: "$21,000", q3: "$19,500" },
  { category: "Marketing", q1: "$6,000", q2: "$7,200", q3: "$6,800" },
];

export default function TableBordered() {
  return (
    <Table variant="bordered">
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Q1</TableHead>
          <TableHead>Q2</TableHead>
          <TableHead>Q3</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((row) => (
          <TableRow key={row.category}>
            <TableCell className="font-medium">{row.category}</TableCell>
            <TableCell>{row.q1}</TableCell>
            <TableCell>{row.q2}</TableCell>
            <TableCell>{row.q3}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>$28,200</TableCell>
          <TableCell>$32,000</TableCell>
          <TableCell>$31,400</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
