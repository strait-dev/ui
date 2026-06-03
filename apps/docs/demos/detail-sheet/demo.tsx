"use client";

import { Button } from "@strait/ui/components/button";
import {
  DetailSheet,
  DetailSheetRow,
  DetailSheetSection,
} from "@strait/ui/components/detail-sheet";
import { useState } from "react";

export default function DetailSheetDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        View deployment
      </Button>
      <DetailSheet
        meta="run-id: 0xDEADBEEF · 2 min ago"
        onOpenChange={setOpen}
        open={open}
        title="Deployment #d-42"
      >
        <DetailSheetSection heading="Summary">
          <DetailSheetRow label="Status">deployed</DetailSheetRow>
          <DetailSheetRow label="Environment">production</DetailSheetRow>
          <DetailSheetRow label="Region">us-east-1</DetailSheetRow>
          <DetailSheetRow label="Version">v1.4.2</DetailSheetRow>
        </DetailSheetSection>
        <DetailSheetSection heading="Timing">
          <DetailSheetRow label="Started">
            2024-01-15 09:32:04 UTC
          </DetailSheetRow>
          <DetailSheetRow label="Duration">2m 7s</DetailSheetRow>
        </DetailSheetSection>
      </DetailSheet>
    </>
  );
}
