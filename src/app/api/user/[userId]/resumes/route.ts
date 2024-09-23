import { auth } from "@clerk/nextjs/server";
import { Resumes } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const { resumes } = await req.json();

    if (!userId) {
      return new NextResponse("UserId is missing", { status: 400 });
    }

    if (!resumes || !Array.isArray(resumes) || resumes.length === 0) {
      return new NextResponse("Invalid resumes format", { status: 400 });
    }

    const createdResumes: Resumes[] = [];

    for (const resume of resumes) {
      const { name, url } = resume;

      const existingData = await prisma.resumes.findFirst({
        where: {
          userProfileId: userId,
          url,
        },
      });

      if (existingData) {
        console.log();
        continue;
      }

      const resumesData = await prisma.resumes.create({
        data: {
          userProfileId: userId,
          name,
          url,
        },
      });

      createdResumes.push(resumesData);
    }

    return NextResponse.json(createdResumes);
  } catch (error) {
    console.error(`RESUMES_POST error: ${error}`); // Log any error caught
    return new NextResponse("Invalid Server error", { status: 500 });
  }
}
