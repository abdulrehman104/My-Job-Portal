import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function PATCH(req: Request) {
  try {
    const { userId } = auth();

    const jobId = await req.text();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Job ID is missing", { status: 400 });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: { appliedJobs: true },
    });

    if (!profile) {
      return new NextResponse("User profile not found", { status: 404 });
    }

    const alreadyApplied = profile.appliedJobs.some(
      (appliedJob) => appliedJob.jobId === jobId,
    );

    if (alreadyApplied) {
      return new NextResponse("Job already applied", { status: 400 });
    }

    // Add the job to the appliedJobs array
    const updatedProfile = await prisma.userProfile.update({
      where: { userId },
      data: {
        appliedJobs: {
          create: {
            jobId, // Add jobId to appliedJobs
          },
        },
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error(`Error applying for job: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
