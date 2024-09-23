import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { jobId: string } },
) {
  try {
    const { userId } = auth();
    const { jobId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("JobId is missing", { status: 400 });
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
    });

    if (!job) {
      return new NextResponse("Job is missing", { status: 400 });
    }

    const userInder = job.savedUsers.indexOf(userId);
    let updatedData;
    if (userInder !== -1) {
      updatedData = await prisma.job.update({
        where: {
          id: jobId,
          userId,
        },
        data: {
          savedUsers: {
            set: job.savedUsers.filter((savedUserId) => savedUserId !== userId),
          },
        },
      });
    }

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error(`JOB_UPDATE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
