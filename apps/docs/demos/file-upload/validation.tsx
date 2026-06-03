import { FileUpload } from "@strait/ui/components/file-upload";

export default function FileUploadValidation() {
  return <FileUpload accept="image/*" className="w-96" maxSize={1024 * 512} />;
}
