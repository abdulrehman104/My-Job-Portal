import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";
import prisma from "@/lib/prismadb";

type GetJobs = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  shiftTiming?: string;
  workMode?: string;
  yearsOfExperience?: string;
  savedUsers?: boolean;
};

export const getJobs = async ({
  title,
  categoryId,
  createdAtFilter,
  shiftTiming,
  workMode,
  yearsOfExperience,
  savedUsers,
}: GetJobs): Promise<Job[]> => {
  const { userId } = auth();

  try {
    // Initialize the query object with common options
    let query: any = {
      where: {
        isPublished: true,
      },
      include: {
        company: true,
        category: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    // Add conditions for title and categoryId if they are defined
    if (typeof title !== "undefined" || typeof categoryId !== "undefined") {
      query.where.AND = [
        title && {
          title: {
            contains: title,
            mode: "insensitive", // Case-insensitive search for title
          },
        },
        categoryId && {
          categoryId: {
            equals: categoryId, // Exact match for categoryId
          },
        },
      ].filter(Boolean); // Filters out any false or undefined conditions
    }

    // Add conditions for createdAtFilter if they are defined
    if (createdAtFilter) {
      const today = new Date();
      let startDate: Date;

      switch (createdAtFilter) {
        case "today":
          // Start date is today
          startDate = new Date(today);
          break;

        case "yesterday":
          // Start date is the previous day
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 1);
          break;

        case "thisWeek":
          // Start date is the first day of the current week (Sunday)
          startDate = new Date(today);
          const currentDayOfWeek = startDate.getDay(); // Sunday is 0, Monday is 1, and so on
          startDate.setDate(today.getDate() - currentDayOfWeek);
          break;

        case "lastWeek":
          // Start date is the first day of the previous week (Sunday)
          startDate = new Date(today);
          const daysSinceLastWeekStart = startDate.getDay() + 7; // Get the first Sunday of last week
          startDate.setDate(today.getDate() - daysSinceLastWeekStart);
          break;

        case "thisMonth":
          // Start date is the first day of the current month
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;

        default:
          startDate = new Date(0); // Fallback to a very early date if filter is invalid
      }

      // Add createdAt condition in the query to filter jobs based on the calculated startDate
      query.where.AND = [
        ...(query.where.AND || []), // Preserve existing conditions
        {
          createdAt: {
            gte: startDate, // Only return jobs created after or on the start date
          },
        },
      ];
    }

    let formatedWorkMode = workMode?.split(",");
    if (formatedWorkMode && formatedWorkMode.length > 0) {
      query.where.workMode = {
        in: formatedWorkMode,
      };
    }

    let formatedshiftTiming = shiftTiming?.split(",");
    if (formatedshiftTiming && formatedshiftTiming.length > 0) {
      query.where.shiftTiming = {
        in: formatedshiftTiming,
      };
    }

    let formatedYearsOfExperience = yearsOfExperience?.split(",");
    if (formatedYearsOfExperience && formatedYearsOfExperience.length > 0) {
      query.where.yearsOfExperience = {
        in: formatedYearsOfExperience,
      };
    }

    if (savedUsers) {
      query.where.savedUsers = {
        has: userId,
      };
    }

    // Execute the query to fetch jobs based on constructed parameters
    const jobs = await prisma.job.findMany(query);
    return jobs;
  } catch (error) {
    console.log("GET_JOBS:", error);
    return [];
  }
};
