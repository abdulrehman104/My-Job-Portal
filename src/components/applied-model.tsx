"use client";

import { useEffect, useState } from "react";

import { AppliedJob, Resumes, UserProfile } from "@prisma/client";
import Model from "./ui/model";
import { Box } from "@/components/box";
import { Label } from "./ui/label";
import Link from "next/link";
import { Button } from "./ui/button";

interface AppliedModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConform: () => void;
  loading: boolean;
  userProfile:
    | (UserProfile & { resumes: Resumes[]; appliedJobs: AppliedJob[] })
    | null;
}

const AppliedModel = ({
  isOpen,
  onClose,
  onConform,
  loading,
  userProfile,
}: AppliedModelProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Model
      title="Are you sure"
      description="This action can be undone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Box>
        <div className="grid w-full grid-cols-2 gap-2">
          <Label className="rounded-md border p-3">
            {userProfile?.fullName}
          </Label>
          <Label className="rounded-md border p-3">
            {userProfile?.contact}
          </Label>
          <Label className="col-span-2 rounded-md border p-3">
            {userProfile?.email}
          </Label>
          <Label className="col-span-2 flex items-center gap-x-2 rounded-md border p-3">
            Active Resume:
            <span className="w-full truncate text-purple-700">
              {userProfile?.resumes.find(
                (resume) => resume.id === userProfile?.ActiveResumeById,
              )?.name || "No Active Resume Found"}
            </span>
          </Label>
        </div>
      </Box>
      <div className="text-muted-foreground my-2 flex items-center justify-end gap-x-2 text-sm">
        Change your Details
        <Link href={"/user"} className="text-purple-700">
          over here
        </Link>
      </div>
      <div className="my-4 flex items-center justify-end gap-x-2">
        <Button onClick={onClose} variant="outline" disabled={loading}>
          Cancel
        </Button>
        <Button
          className="bg-purple-700 text-white hover:bg-purple-900 hover:text-white"
          disabled={loading}
          onClick={onConform}
        >
          Continue
        </Button>
      </div>
    </Model>
  );
};

export default AppliedModel;
