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

    const updatedData = {
      savedUsers: job.savedUsers ? { push: userId } : [userId],
    };

    const unPublishJob = await prisma.job.update({
      where: {
        id: jobId,
      },
      data: updatedData,
    });

    return NextResponse.json(unPublishJob);
  } catch (error) {
    console.error(`JOB_UPDATE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
