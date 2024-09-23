import { Label } from "@/components/ui/label";
import supabase from "@/lib/supabase-client";
import { FilePlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AttachmentUploderProps {
  disable: boolean;
  onChange: (value: { url: string; name: string }[]) => void;
  value: { url: string; name: string }[];
}

export const AttachmentUploder = ({
  disable,
  onChange,
  value,
}: AttachmentUploderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsLoading(true);
    setProgress(0);

    // Array to store newly uploaded URLs
    const newUrls: { url: string; name: string }[] = [];

    // Total bytes for all files
    const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
    let uploadedBytes = 0;

    // Counter to keep track of uploaded files
    let countedFiles = 0;

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;

      try {
        // Supabase Storage Upload
        const { data, error } = await supabase.storage
          .from("Attachments")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          toast.error(`Error uploading ${file.name}: ${error.message}`);
          setIsLoading(false);
          return;
        }

        // Get Public URL
        const { data: publicURL } = supabase.storage
          .from("Attachments")
          .getPublicUrl(fileName);

        if (!publicURL) {
          toast.error(`Error getting public URL for ${file.name}`);
          setIsLoading(false);
          return;
        }

        // Store this URL
        newUrls.push({ url: publicURL.publicUrl, name: file.name });
        // Update progress
        uploadedBytes += file.size;
        setProgress((uploadedBytes / totalBytes) * 100);

        // Increase the count of successfully uploaded files
        countedFiles++;
      } catch (err) {
        toast.error(`An error occurred during file upload: ${file.name}`);
        setIsLoading(false);
        return;
      }
    }

    // After all files are uploaded
    if (countedFiles === files.length) {
      setIsLoading(false);
      onChange([...value, ...newUrls]);
      toast.success("All files uploaded successfully!");
    } else {
      toast.error("Some files failed to upload.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-40 w-full items-center justify-center rounded-lg bg-purple-100">
      {isLoading ? (
        <>
          <p className="text-neutral-500">{`${progress.toFixed(2)}%`}</p>
        </>
      ) : (
        <Label className="flex cursor-pointer items-center justify-center gap-x-2">
          <FilePlus className="size-4" />
          <p>Add a file</p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"
            multiple
            className="hidden"
            onChange={onUpload}
            disabled={disable}
          />
        </Label>
      )}
    </div>
  );
};
