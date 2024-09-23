"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { Job } from "@prisma/client";
import { CardItems } from "./card-items";

interface PageContentProps {
  jobs: Job[];
  userId: string | null;
}

export const PageContent = ({ jobs, userId }: PageContentProps) => {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center  ">
        <div className="relative h-[60vh] w-full ">
          <Image
            alt="not-found"
            src="/404.svg"
            fill
            className="size-full object-contain"
          />
        </div>
        <p className="text-muted-foreground text-4xl font-semibold ">
          No Job Found
        </p>
      </div>
    );
  }
  return (
    <div className="pt-6">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          layout
          className="grid grid-cols-1 gap-x-2 space-y-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          {jobs.map((job) => (
            <CardItems key={job.id} userId={userId} job={job} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
