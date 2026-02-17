import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadButtonProps {
  onUpload: (url: string) => void;
  bucket?: string;
  accept?: string;
  label?: string;
  multiple?: boolean;
  onMultiUpload?: (urls: string[]) => void;
}

const ImageUploadButton = ({ onUpload, bucket = "site-images", accept = "image/*", label = "Upload Image", multiple = false, onMultiUpload }: ImageUploadButtonProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const { error } = await supabase.storage.from(bucket).upload(fileName, file);
        if (error) throw error;
        const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
        urls.push(data.publicUrl);
      }
      if (multiple && onMultiUpload) {
        onMultiUpload(urls);
      } else if (urls.length > 0) {
        onUpload(urls[0]);
      }
      toast.success(`${urls.length} file(s) uploaded!`);
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      <input ref={fileRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={e => handleFiles(e.target.files)} />
      <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading} className="text-xs sm:text-sm">
        {uploading ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Upload className="w-3.5 h-3.5 mr-1" />}
        {uploading ? "Uploading..." : label}
      </Button>
    </>
  );
};

export default ImageUploadButton;
