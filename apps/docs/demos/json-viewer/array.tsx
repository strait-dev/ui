import { JsonViewer } from "@strait/ui/components/json-viewer";

const data = [
  { id: 1, status: "success", latency: 42, region: "us-east-1" },
  { id: 2, status: "pending", latency: null, region: "eu-west-1" },
  { id: 3, status: "error", latency: null, region: "ap-southeast-1" },
];

export default function JsonViewerArrayDemo() {
  return (
    <div className="max-w-lg">
      <JsonViewer data={data} defaultExpanded={2} rootLabel="results" />
    </div>
  );
}
