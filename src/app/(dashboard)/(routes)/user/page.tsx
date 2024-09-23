import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";

import prisma from "@/lib/prismadb";
import { Box } from "@/components/box";
import { CustomBreadCrumb } from "@/components/custom-breadcrumb";
import { UserNameForm } from "./_Components/user-name-form";
import { UserContactForm } from "./_Components/user-contact-form";
import { UserEmailForm } from "./_Components/user-email-form";
import { UserResumeForm } from "./_Components/user-resume-form";
import { AppliedJobsColumns, columns } from "./_Components/columns";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { truncate } from "lodash";

export default async function UserPage() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/");
  }

  // fetch user profile in our data base
  const profile = await prisma.userProfile.findUnique({
    where: {
      userId: userId,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
      appliedJobs: true,
    },
  });

  // fetch all joibs in our database
  const jobs = await prisma.job.findMany({
    where: {
      userId,
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Filter all jobs with the help of user profile
  const filterAppliedJobs =
    profile && profile.appliedJobs.length > 0
      ? jobs
          .filter((job) =>
            profile.appliedJobs.some(
              (appliedJob) => appliedJob.jobId === job.id
            )
          )
          .map((job) => ({
            ...job,
            appliedAt: profile.appliedJobs.find(
              (appliedJob) => appliedJob.jobId === job.id
            )?.appliedAt,
          }))
      : [];

  // Format job according to job columns
  const formatedData: AppliedJobsColumns[] = filterAppliedJobs.map((job) => ({
    id: job.id,
    title: job.title ? job.title : "",
    category: job.category?.name ? job.category.name : "",
    company: job.company?.name ? job.company.name : "",
    createdAt: job.createdAt ? format(job.createdAt, "MMMM do , yyyy") : "N/A",
  }));

  const followedCompanies = await prisma.company.findMany({
    where: {
      followers: {
        has: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex w-full flex-col items-center justify-center p-4 md:p-8">
      <Box>
        <CustomBreadCrumb BreadCrumbPage="My Profile" />
      </Box>

      <Box className="mt-8 flex-col items-center justify-between space-y-6 rounded-md border p-4">
        {/* User Image */}
        {user && user.hasImage && (
          <div className=" relative aspect-square size-24">
            <Image
              src={user.imageUrl}
              alt="User Profile"
              fill
              className="size-full rounded-full object-cover"
            />
          </div>
        )}

        {/* User Name */}
        <UserNameForm userId={userId} initialData={profile} />

        {/* User Email */}
        <UserEmailForm userId={userId} initialData={profile} />

        {/* User Contact */}
        <UserContactForm userId={userId} initialData={profile} />

        {/* User Resumes */}
        <UserResumeForm userId={userId} initialData={profile} />
      </Box>

      {/* Applied Job Table */}
      <Box className="mt-6 flex-col items-start justify-normal">
        <h2 className="text-muted-foreground text-2xl font-semibold">
          Applied Jobs
        </h2>

        <div className="mt-6 w-full">
          <DataTable
            columns={columns}
            data={formatedData}
            searchKey="category"
          />
        </div>
      </Box>

      {/* Those companies which can follow by user  */}
      <Box className="mt-6 flex-col items-start justify-normal">
        <h2 className="text-muted-foreground text-2xl font-semibold">
          Followed Companies
        </h2>

        <div className="my-6 grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {followedCompanies.length === 0 ? (
            <p>No Companies follow yet</p>
          ) : (
            <>
              {followedCompanies.map((company) => (
                <Card className="relative space-y-2 p-3" key={company.id}>
                  {company.logo && (
                    <div className="relative flex h-24 w-full items-center justify-center overflow-hidden">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  {company.name && (
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                  )}

                  {company.description && (
                    <CardDescription>
                      {truncate(company.description, {
                        length: 80,
                        omission: "...",
                      })}
                    </CardDescription>
                  )}
                </Card>
              ))}
            </>
          )}
        </div>
      </Box>
    </div>
  );
}
