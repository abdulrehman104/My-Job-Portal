"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Currency,
  Layers,
  Loader2,
  Network,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Card, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box } from "./box";
import { cn, formatedString } from "@/lib/utils";
import { Company, Job } from "@prisma/client";

interface CardItemsProps {
  job: Job;
  userId: string | null;
}

export const CardItems = ({ job, userId }: CardItemsProps) => {
  const router = useRouter();
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const isSavedUser = userId && job.savedUsers?.includes(userId);
  const SavedJobs = isSavedUser ? BookmarkCheck : Bookmark;

  const typeJob = job as Job & {
    company: Company;
  };

  const company = typeJob.company;

  const onClickSavedJobs = async () => {
    try {
      setIsBookmarkLoading(true);
      if (isSavedUser) {
        await axios.patch(`api/jobs/${job.id}/removeJob`);
        toast.success("Remove Job");
      } else {
        await axios.patch(`api/jobs/${job.id}/savedJob`);
        toast.success("Saved Job ");
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(`ERROR:${error}`);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <motion.div layout>
      <Card>
        <div className="flex flex-col items-start justify-start gap-y-4 p-4">
          <Box>
            <p className="text-muted-foreground text-sm">
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
              })}
            </p>
            <Button variant="ghost" size="icon">
              {isBookmarkLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <div onClick={onClickSavedJobs}>
                  <SavedJobs
                    className={cn(
                      "size-4",
                      isSavedUser
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                    )}
                  />
                </div>
              )}
            </Button>
          </Box>
          <Box className="items-center justify-start gap-x-4">
            <div
              className="relative flex size-12 min-h-12 min-w-12 items-center justify-center
            overflow-hidden rounded-md border p-2 "
            >
              {company?.logo && (
                <Image
                  src={company?.logo}
                  alt="Company Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
            </div>
            <div className="w-full">
              <p className="text-base font-semibold text-stone-700">
                {job.title}
              </p>
              <Link
                className="text-sm text-purple-700"
                href={`/companies/${company?.id}`}
              >
                {company?.name}
              </Link>
            </div>
          </Box>
          <Box>
            {job.shiftTiming && (
              <div className="text-muted-foreground flex items-center text-sm">
                <BriefcaseBusiness className="mr-1 size-4" />
                {formatedString(job.shiftTiming)}
              </div>
            )}
            {job.workMode && (
              <div className="text-muted-foreground flex items-center text-sm">
                <Layers className="mr-1 size-4" />
                {formatedString(job.workMode)}
              </div>
            )}
            {job.hourlyRate && (
              <div className="text-muted-foreground flex items-center text-sm">
                <Currency className="mr-1 size-4" />
                {`${formatedString(job.hourlyRate)} $/hrs`}
              </div>
            )}
            {job.yearsOfExperience && (
              <div className="text-muted-foreground flex items-center text-sm">
                <Network className="mr-1 size-4" />
                {formatedString(job.yearsOfExperience)}
              </div>
            )}
          </Box>
          {job.short_description && (
            <CardDescription>
              {truncate(job.short_description, {
                length: 80,
                omission: "...",
              })}
            </CardDescription>
          )}

          {job.tags && (
            <Box className="flex-wrap justify-normal gap-x-2">
              {job.tags.slice(0, 6).map((tag, i) => (
                <p
                  key={i}
                  className="rounded-md bg-gray-100 px-2 py-[2px] text-xs font-semibold text-neutral-700"
                >
                  {tag}
                </p>
              ))}
            </Box>
          )}

          <Box className="mt-auto gap-2">
            <Link href={`/search/${job.id}`} className="w-full">
              <Button
                variant="outline"
                className="w-full border-purple-700 text-purple-700 hover:border-purple-500 hover:text-purple-500"
              >
                Details
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full bg-purple-700 text-white hover:bg-purple-500 hover:text-white"
              onClick={onClickSavedJobs}
            >
              {isSavedUser ? "Saved" : "Saved for later"}
            </Button>
          </Box>
        </div>
      </Card>
    </motion.div>
  );
};
