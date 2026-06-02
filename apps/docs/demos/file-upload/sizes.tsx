import { FileUpload } from "@strait/ui/components/file-upload";

export default function FileUploadSizes() {
  return (
    <div className="flex w-96 flex-col gap-4">
      <FileUpload label="Small" size="sm" />
      <FileUpload label="Default" size="default" />
      <FileUpload label="Large" size="lg" />
    </div>
  );
}
