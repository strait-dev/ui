import { JsonViewer } from "@strait/ui/components/json-viewer";

const data = {
  user: {
    id: "usr_9f3a1c2b",
    profile: {
      name: "Alice Nguyen",
      email: "alice@example.com",
      avatar: null,
    },
    roles: ["admin", "editor"],
    meta: {
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2025-03-22T08:12:00Z",
    },
  },
  pagination: {
    page: 1,
    pageSize: 20,
    total: 142,
    hasNext: true,
  },
};

export default function JsonViewerNestedDemo() {
  return (
    <div className="max-w-lg">
      <JsonViewer copyable data={data} defaultExpanded={2} />
    </div>
  );
}
