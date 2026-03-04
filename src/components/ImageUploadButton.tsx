import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadButtonProps {
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
}

const ImageUploadButton = ({ onUpload, accept = "image/*", label = "Upload Image" }: ImageUploadButtonProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        onUpload(reader.result as string);
        toast.success("Image loaded!");
        setUploading(false);
      };
      reader.onerror = () => {
        toast.error("Failed to read image");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Upload failed");
      setUploading(false);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
        {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Upload className="w-4 h-4 mr-1" />}
        {label}
      </Button>
    </>
  );
};

export default ImageUploadButton;
