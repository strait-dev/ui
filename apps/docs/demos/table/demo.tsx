import { Badge } from "@strait/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@strait/ui/components/table";

const projects = [
  {
    name: "Design System",
    owner: "Alice Martin",
    status: "Active",
    budget: "$12,000",
  },
  {
    name: "Marketing Site",
    owner: "Bob Chen",
    status: "Completed",
    budget: "$8,500",
  },
  {
    name: "Mobile App",
    owner: "Carol Singh",
    status: "Active",
    budget: "$32,000",
  },
  {
    name: "Analytics Pipeline",
    owner: "Daniel Rivera",
    status: "Paused",
    budget: "$18,000",
  },
];

export default function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Budget</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.name}>
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>{project.owner}</TableCell>
            <TableCell>
              <Badge
                variant={project.status === "Active" ? "secondary" : "outline"}
              >
                {project.status}
              </Badge>
            </TableCell>
            <TableCell>{project.budget}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
