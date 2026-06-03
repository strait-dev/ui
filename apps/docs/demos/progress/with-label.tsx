"use client";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@strait/ui/components/progress";

export default function ProgressWithLabel() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Progress value={60}>
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue>{(formatted) => formatted}</ProgressValue>
      </Progress>

      <Progress value={33} variant="warning">
        <ProgressLabel>Processing</ProgressLabel>
        <ProgressValue>{(formatted) => formatted}</ProgressValue>
      </Progress>

      <Progress value={100} variant="success">
        <ProgressLabel>Complete</ProgressLabel>
        <ProgressValue>{() => "Done"}</ProgressValue>
      </Progress>
    </div>
  );
}
