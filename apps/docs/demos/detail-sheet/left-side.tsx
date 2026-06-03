"use client";

import { Button } from "@strait/ui/components/button";
import {
  DetailSheet,
  DetailSheetRow,
  DetailSheetSection,
} from "@strait/ui/components/detail-sheet";
import { useState } from "react";

export default function DetailSheetLeftSide() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Open from left
      </Button>
      <DetailSheet
        meta="ID: usr_7a2b3c4d"
        onOpenChange={setOpen}
        open={open}
        side="left"
        title="User profile"
      >
        <DetailSheetSection heading="Account">
          <DetailSheetRow label="Name">Jane Smith</DetailSheetRow>
          <DetailSheetRow label="Email">jane@example.com</DetailSheetRow>
          <DetailSheetRow label="Role">Admin</DetailSheetRow>
        </DetailSheetSection>
        <DetailSheetSection heading="Activity">
          <DetailSheetRow label="Last login">2024-01-16</DetailSheetRow>
          <DetailSheetRow label="Sessions">3 active</DetailSheetRow>
        </DetailSheetSection>
      </DetailSheet>
    </>
  );
}
