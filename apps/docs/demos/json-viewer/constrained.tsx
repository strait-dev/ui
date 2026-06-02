import { JsonViewer } from "@strait/ui/components/json-viewer";

const data = {
  id: "evt_abc123",
  type: "checkout.session.completed",
  created: 1_716_400_000,
  data: {
    object: {
      customer: "cus_xyz789",
      amount_total: 4999,
      currency: "usd",
      payment_status: "paid",
      metadata: { order_id: "ord_001", source: "web" },
    },
  },
  livemode: false,
  api_version: "2024-04-10",
};

export default function JsonViewerConstrainedDemo() {
  return (
    <div className="max-w-lg">
      <JsonViewer
        copyable
        data={data}
        defaultExpanded={true}
        maxHeight={240}
        rootLabel="event"
      />
    </div>
  );
}
