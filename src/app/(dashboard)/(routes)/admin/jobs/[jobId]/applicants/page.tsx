import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { CustomBreadCrumb } from "@/components/custom-breadcrumb";
import { Box } from "@/components/box";
import { DataTable } from "@/components/ui/data-table";
import { ApplicantsColumns, columns } from "./_components/columns";
import { format } from "date-fns";

export default async function ApplicantsPage({
  params,
}: {
  params: { jobId: string };
}) {
  const { userId } = auth();

  const job = await prisma.job.findUnique({
    where: {
      id: params.jobId,
      userId: userId as string,
    },
  });

  if (!job) {
    redirect("/admin/jobs");
  }

  const profile = await prisma.userProfile.findMany({
    include: {
      appliedJobs: true,
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const jobs = await prisma.job.findMany({
    where: {
      userId: userId as string,
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const filteredProffile =
    profile &&
    profile.filter((profile) =>
      profile.appliedJobs.some(
        (appliedJob) => appliedJob.jobId === params.jobId,
      ),
    );

  const formattedProfiles: ApplicantsColumns[] = filteredProffile.map(
    (profile) => ({
      id: profile.userId,
      fullName: profile.fullName ? profile.fullName : "",
      email: profile.email ? profile.email : "",
      contact: profile.contact ? profile.contact : "",
      appliedAt: profile.appliedJobs.find((job) => job.jobId === params.jobId)
        ?.appliedAt
        ? format(
            new Date(
              profile.appliedJobs.find((job) => job.jobId === params.jobId)
                ?.appliedAt ?? "",
            ),
            "MMMM do, yyyy",
          )
        : "",
      resumes:
        profile.resumes.find((res) => res.id === profile.ActiveResumeById)
          ?.url ?? "",
      resumeName:
        profile.resumes.find((res) => res.id === profile.ActiveResumeById)
          ?.name ?? "",
    }),
  );

  return (
    <div className="p4 flex flex-col items-center md:p-8">
      <Box>
        <CustomBreadCrumb
          BreadCrumbItems={[
            { href: "/admin/jobs", label: "Jobs" },
            { href: "/admin/jobs", label: `${job ? job.title : ""}` },
          ]}
          BreadCrumbPage="Applicants"
        />
      </Box>
      <div className="mt-6 w-full">
        <DataTable
          columns={columns}
          data={formattedProfiles}
          searchKey="fullName"
        />
      </div>
    </div>
  );
}
