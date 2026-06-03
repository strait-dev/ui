import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@strait/ui/components/table";

const rows = [
  { name: "Alice Martin", role: "Designer", department: "Product" },
  { name: "Bob Chen", role: "Engineer", department: "Platform" },
  { name: "Carol Singh", role: "Manager", department: "Engineering" },
];

function PeopleTable({ size }: { size: "sm" | "default" | "lg" }) {
  return (
    <div>
      <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">
        size=&quot;{size}&quot;
      </p>
      <Table size={size}>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell className="text-muted-foreground">
                {row.department}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function TableSizes() {
  return (
    <div className="flex flex-col gap-8">
      <PeopleTable size="sm" />
      <PeopleTable size="default" />
      <PeopleTable size="lg" />
    </div>
  );
}
