import { Job } from "@prisma/client";
import Link from "next/link";

import { Box } from "@/components/box";
import { PageContent } from "@/components/page-content";
import { Button } from "@/components/ui/button";

interface RecommendedJobsListProps {
  jobs: Job[];
  userId: string | null;
}

export const RecommendedJobsList = ({
  jobs,
  userId,
}: RecommendedJobsListProps) => {
  return (
    <Box className="my-6 mt-12 flex-col justify-center gap-y-4">
      <h2 className="font-sans text-2xl font-bold tracking-wider">
        Recommended Jobs
      </h2>
      <div className="mt-4">
        <PageContent jobs={jobs} userId={userId} />
      </div>
      <Link href="/search" className="my-8">
        <Button className="h-12 w-44 rounded-xl border border-purple-500 bg-transparent text-purple-500 hover:bg-transparent hover:text-purple-600 hover:shadow-md">
          View All Jobs
        </Button>
      </Link>
    </Box>
  );
};
