import { auth } from "@clerk/nextjs/server";
import { Attachments } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { jobId: string } },
) {
  try {
    const { userId } = auth();
    const { jobId } = params;
    const { attachments } = await req.json();

    if (!userId) {
      return new NextResponse("UsedId is missing", { status: 400 });
    }

    if (!jobId) {
      return new NextResponse("Job id is missing", { status: 400 });
    }

    if (
      !attachments ||
      !Array.isArray(attachments) ||
      attachments.length == 0
    ) {
      return new NextResponse("Invalid Attachments Format", { status: 401 });
    }

    const createdAttachments: Attachments[] = [];

    for (const attachment of attachments) {
      const { name, url } = attachment;

      const existingData = await prisma.attachments.findFirst({
        where: {
          url,
          jobId,
        },
      });

      if (existingData) {
        console.log(
          `Attachment with URL ${url} already exists for jobId ${jobId}`,
        );
        continue;
      }

      const attachmentData = await prisma.attachments.create({
        data: {
          url,
          name,
          jobId,
        },
      });
      createdAttachments.push(attachmentData);
    }
    return NextResponse.json(createdAttachments);
  } catch (error) {
    console.error(`ATTACHMENTS_POST: ${error}`);
    return new NextResponse("Invalid Server error", { status: 500 });
  }
}
