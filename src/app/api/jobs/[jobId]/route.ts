import prisma from "@/lib/prismadb";
import supabase from "@/lib/supabase-client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { jobId: string } },
) {
  try {
    const { userId } = auth();
    const { jobId } = params;
    const updatedValues = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("JobId is missing", { status: 400 });
    }

    if (!updatedValues) {
      return new NextResponse("Updated values are missing", { status: 400 });
    }

    const jobData = await prisma.job.update({
      where: {
        id: jobId,
        userId,
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(jobData);
  } catch (error) {
    console.error(`JOB_UPDATE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
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
      include: {
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!job) {
      return new NextResponse("Job is missing", { status: 400 });
    }

    // Delete Image from Supabase Storage
    if (job.imageUrl) {
      const filePath = job.imageUrl.split("/").slice(-1)[0];

      const { error } = await supabase.storage
        .from("Images")
        .remove([filePath]);

      if (error) {
        console.error("Error deleting Image:", error.message);
        return new NextResponse("Image URL is missing", { status: 400 });
      }
    }

    // Delete Attachment from Supabase Storage
    if (Array.isArray(job.attachments) && job.attachments.length > 0) {
      for (const attachment of job.attachments) {
        const fileUrl = attachment.url;
        const filePath = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

        if (!filePath) {
          return new NextResponse("Attachment File Not Found", { status: 404 });
        }

        const { error } = await supabase.storage
          .from("Attachments")
          .remove([filePath]);

        if (error) {
          console.error("Error deleting file from storage:", error.message);
          return new NextResponse("Failed to delete file from storage", {
            status: 500,
          });
        }
      }
    }

    const jobData = await prisma.job.delete({
      where: {
        id: jobId,
        userId,
      },
    });

    return NextResponse.json(jobData);
  } catch (error) {
    console.error(`JOB_UPDATE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
