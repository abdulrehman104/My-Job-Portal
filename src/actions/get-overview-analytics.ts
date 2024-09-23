import prisma from "@/lib/prismadb";

// All jobs in our portal
export const getTotalJobOnPortal = async () => {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  });

  return jobs?.length;
};

// Jobs created by  user
export const getTotalJobOnPortalByUserId = async (userId: string | null) => {
  if (!userId) {
    return 0;
  }

  const jobs = await prisma.job.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return jobs?.length;
};

// All companies registered in our portal
export const getTotalCompaniesOnPortal = async () => {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
  });

  return companies?.length;
};

// Companies Created by user
export const getTotalCompaniesOnPortalByUserId = async (
  userId: string | null,
) => {
  if (!userId) {
    return 0;
  }

  const companies = await prisma.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return companies?.length;
};

interface PieChartMonthlyCount {
  name: string;
  value: number;
}

// Get all jobs created by the user for rendering in the chart
export const getPeiGraphJobCreatedByUser = async (
  userId: string | null,
): Promise<PieChartMonthlyCount[]> => {
  if (!userId) {
    return [];
  }

  const jobs = await prisma.job.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const currentYear = new Date().getFullYear();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Initialize result array with all months and zero values
  const monthlyCount: PieChartMonthlyCount[] = months.map((month) => ({
    name: month,
    value: 0,
  }));

  jobs.forEach((job) => {
    const createdAt = new Date(job.createdAt);
    const monthIndex = createdAt.getMonth(); // Get the month as an index (0 = Jan, 11 = Dec)
    const year = createdAt.getFullYear();

    // Only count jobs created in the current year
    if (year === currentYear) {
      monthlyCount[monthIndex].value++; // Increment the correct month based on the index
    }
  });

  return monthlyCount;
};

// Get all companies created by the user for rendering in the chart
export const getPeiGraphCompanyCreatedByUser = async (
  userId: string | null,
): Promise<PieChartMonthlyCount[]> => {
  if (!userId) {
    return [];
  }

  const companies = await prisma.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const currentYear = new Date().getFullYear();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Initialize result array with all months and zero values
  const monthlyCount: PieChartMonthlyCount[] = months.map((month) => ({
    name: month,
    value: 0,
  }));

  companies.forEach((company) => {
    const createdAt = new Date(company.createdAt);
    const monthIndex = createdAt.getMonth(); // Get the month index (0 for January, 11 for December)
    const year = createdAt.getFullYear();

    // Only count companies created in the current year
    if (year === currentYear) {
      monthlyCount[monthIndex].value++; // Increment the count for the corresponding month
    }
  });

  return monthlyCount;
};
