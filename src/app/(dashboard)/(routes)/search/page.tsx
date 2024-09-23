import { auth } from "@clerk/nextjs/server";

import { SearchContainer } from "@/components/search-container";
import { CategoryList } from "./_components/category-list";
import { PageContent } from "@/components/page-content";
import { getJobs } from "@/actions/get-jobs";
import prisma from "@/lib/prismadb";

interface SearchProps {
  searchParams: {
    title: string;
    categoryId: string;
    shiftTiming: string;
    workMode: string;
    yearsOfExperience: string;
    createdAtFilter: string;
  };
}

export default async function Search({ searchParams }: SearchProps) {
  const { userId } = auth();
  const jobs = await getJobs({ ...searchParams });

  const category = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      {/* Search Bar */}
      <div className="block px-6 pt-6 md:hidden">
        <SearchContainer />
      </div>

      {/* Category and Jobs */}
      <div className="p-6">
        {/* Job Category */}
        <CategoryList category={category} />

        {/* Page Content */}
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </>
  );
}
