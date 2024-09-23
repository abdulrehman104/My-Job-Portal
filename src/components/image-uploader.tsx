import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import supabase from "@/lib/supabase-client";
import { ImageIcon, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  disable: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string;
}

export const ImageUploader = ({
  disable,
  onChange,
  onRemove,
  value,
}: ImageUploaderProps) => {
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
    if (!e.target.files) return;
    const file: File = e.target.files[0];
    setIsLoading(true);
    setProgress(50);

    const fileName = `${Date.now()}-${file?.name}`;
    const { data, error } = await supabase.storage
      .from("Images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    const { data: publicURL } = supabase.storage
      .from("Images")
      .getPublicUrl(fileName);

    if (!publicURL) {
      toast.error("Failed to get public URL");
      setIsLoading(false);
      return;
    }

    setProgress(100);
    onChange(publicURL.publicUrl);
    setIsLoading(false);
    toast.success("Image uploaded");
  };

  const onDelete = async (value: string) => {
    onRemove(value);

    const filePath = value.split("/").slice(-1)[0];

    const { error } = await supabase.storage.from("Images").remove([filePath]);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Image deleted successfully");
  };

  return (
    <div>
      {value ? (
        <div className="relative flex aspect-video h-60 w-full items-center justify-center overflow-hidden rounded-md">
          <Image
            src={value}
            alt="Cover Image"
            fill
            className="size-full object-contain"
          />
          <div className="absolute right-2 top-2 z-10 cursor-pointer ">
            <Button
              type="button"
              variant={"destructive"}
              size={"icon"}
              onClick={() => onDelete(value)}
            >
              <Trash className="size-3 " />
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative flex aspect-video h-60 w-full items-center justify-center overflow-hidden rounded-md border border-dashed text-neutral-50">
          {isLoading ? (
            <>
              <p className="text-neutral-500">{`${progress.toFixed(2)}%`}</p>
            </>
          ) : (
            <Label>
              <div className="flex size-full cursor-pointer flex-col items-center justify-center gap-2 text-neutral-500">
                <ImageIcon className="size-10 text-neutral-500" />
                <p>Upload your image</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="size-0"
                onChange={onUpload}
              />
            </Label>
          )}
        </div>
      )}
    </div>
  );
};
