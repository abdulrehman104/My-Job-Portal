"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface JProps {
  jobId: String;
  disabled: boolean;
  isPublished: boolean;
}

export const JobPublishAction = ({ isPublished, disabled, jobId }: JProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(`/api/jobs/${jobId}/unpublish`);
        toast.success("Job unPublish");
      } else {
        await axios.patch(`/api/jobs/${jobId}/publish`);
        toast.success("Job Published");
      }
      // router.refresh();
      location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/jobs/${jobId}`);
      toast.success("Job Deleted");
      router.refresh();
      router.push("/admin/jobs");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {isPublished ? "unPublish" : "Publish"}
      </Button>
      <Button onClick={onDelete} size="icon" disabled={isLoading}>
        <Trash className="size-4" />
      </Button>
    </div>
  );
};
