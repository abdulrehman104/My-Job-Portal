import { getJobs } from "@/actions/get-jobs";
import { Box } from "@/components/box";
import { CustomBreadCrumb } from "@/components/custom-breadcrumb";
import { PageContent } from "@/components/page-content";
import { SearchContainer } from "@/components/search-container";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface SavedJobsProps {
  searchParams: {
    title: string;
    categoryId: string;
    shiftTiming: string;
    workMode: string;
    yearsOfExperience: string;
    createdAtFilter: string;
  };
}
export default async function SavedJobs({ searchParams }: SavedJobsProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const jobs = await getJobs({ ...searchParams, savedUsers: true });

  return (
    <div className="flex-col px-6">
      <Box className="my-4">
        <CustomBreadCrumb BreadCrumbPage="Saved Jobs" />
      </Box>

      <Box className="h-44 w-full items-center justify-center bg-purple-300 ">
        <h2 className="truncate font-sans text-4xl font-bold uppercase">
          Saved Jobs
        </h2>
      </Box>

      <div className="my-4">
        <SearchContainer />
      </div>

      <div className="my-4~">
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </div>
  );
}
