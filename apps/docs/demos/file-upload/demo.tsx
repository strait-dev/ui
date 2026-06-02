import { FileUpload } from "@strait/ui/components/file-upload";

export default function FileUploadDemo() {
  return <FileUpload accept="image/*,.pdf" className="w-96" multiple />;
}
