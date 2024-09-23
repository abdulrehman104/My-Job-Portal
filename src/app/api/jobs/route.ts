import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Job title name is missing", { status: 401 });
    }

    const jobData = await prisma.job.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(jobData);
  } catch (error) {
    console.error(`JOB_POST: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
