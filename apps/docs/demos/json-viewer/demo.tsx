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
    active: true,
    score: 98.7,
  },
  pagination: {
    page: 1,
    pageSize: 20,
    total: 142,
    hasNext: true,
  },
};

export default function JsonViewerDemo() {
  return (
    <div className="w-full max-w-xl">
      <JsonViewer copyable data={data} defaultExpanded={2} />
    </div>
  );
}
