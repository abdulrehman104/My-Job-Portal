import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import supabase from "@/lib/supabase-client";

export async function DELETE(
  req: Request,
  { params }: { params: { jobId: string; attachmentId: string } },
) {
  try {
    const { userId } = auth();
    const { jobId, attachmentId } = params;

    if (!userId) {
      return new NextResponse("UserId is missing", { status: 400 });
    }

    if (!jobId) {
      return new NextResponse("Job id is missing", { status: 400 });
    }

    if (!attachmentId) {
      return new NextResponse("Attachment id is missing", { status: 400 });
    }

    const attachment = await prisma.attachments.findUnique({
      where: {
        id: attachmentId,
      },
    });

    if (!attachment || attachment.jobId !== jobId) {
      return new NextResponse("Attachment Not Found", { status: 404 });
    }

    // Delete file from Supabase Storage
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

    // Delete the record from the database
    await prisma.attachments.delete({
      where: {
        id: attachmentId,
      },
    });

    return new NextResponse("Attachment deleted successfully", { status: 200 });
  } catch (error) {
    console.error(`ATTACHMENTS_DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
