import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prisma from "@/lib/prismadb";
import { JobDetailPage } from "./_components/job-detail-page";
import { getJobs } from "@/actions/get-jobs";
import { Separator } from "@/components/ui/separator";
import { Box } from "@/components/box";
import { PageContent } from "@/components/page-content";

interface JonIdProps {
  params: { jobId: string };
}

export default async function JobId({ params }: JonIdProps) {
  const { userId } = auth();

  const job = await prisma.job.findUnique({
    where: {
      id: params.jobId,
    },
    include: {
      company: true,
      attachments: true,
    },
  });

  if (!job) {
    redirect("/search");
  }

  const profile = await prisma.userProfile.findUnique({
    where: {
      userId: userId as string,
    },
    include: {
      appliedJobs: true,
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!profile) {
    redirect("/user");
  }

  const jobs = await getJobs({});

  const filterJobs = jobs.filter(
    (item) => item.id !== job.id && item.categoryId === job.categoryId,
  );

  return (
    <div className="flex-col p-4 md:p-8">
      <JobDetailPage job={job} jobId={job.id} userProfile={profile} />

      {/* Related Jobs */}
      {filterJobs && filterJobs.length > 0 && (
        <>
          <Separator />
          <Box className="my-4 flex-col items-start justify-start gap-2 px-4">
            <h2 className="text-xl font-semibold">Related Dates</h2>
          </Box>
          <PageContent jobs={filterJobs} userId={userId} />
        </>
      )}
    </div>
  );
}
