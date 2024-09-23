import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

import { HomescreenCategoriesContainer } from "../_components/home-screen-categories-container";
import { HomeSearchContainer } from "../_components/home-search-container";
import { HomeCompaniesList } from "../_components/home-companies-list";
import { RecommendedJobsList } from "../_components/recommended-job";
import { Footer } from "../_components/footer";
import { Box } from "@/components/box";
import { getJobs } from "@/actions/get-jobs";
import prisma from "@/lib/prismadb";

export default async function Dashboard() {
  const { userId } = auth();
  const jobs = await getJobs({});

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-col space-y-24 px-4 py-6">
      <Box className="mt-12 w-full flex-col justify-center space-y-4">
        <h2 className="font-sans text-2xl font-bold tracking-wide text-neutral-600 md:text-4xl">
          Find your dream job now
        </h2>
        <p className="text-muted-foreground text-lg md:text-2xl">
          {jobs.length}+ jobs for you to explore
        </p>
      </Box>

      <HomeSearchContainer />

      <Box className="relative mt-12 h-64  justify-center overflow-hidden rounded-lg">
        <Image
          src="/banner.png"
          alt="Home Screen Banner"
          fill
          className="size-full object-cover"
        />
      </Box>

      <HomescreenCategoriesContainer categories={categories} />

      <HomeCompaniesList companies={companies} />

      <RecommendedJobsList jobs={jobs.splice(0, 8)} userId={userId} />

      <Footer />
    </div>
  );
}
