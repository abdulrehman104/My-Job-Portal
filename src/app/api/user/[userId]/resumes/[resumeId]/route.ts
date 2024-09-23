import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import supabase from "@/lib/supabase-client";

export async function DELETE(
  req: Request,
  { params }: { params: { resumeId: string } },
) {
  try {
    const { userId } = auth();
    const { resumeId } = params;

    if (!userId) {
      return new NextResponse("UserId is missing", { status: 400 });
    }

    if (!resumeId) {
      return new NextResponse("Resume id is missing", { status: 400 });
    }

    const resume = await prisma.resumes.findUnique({
      where: {
        id: resumeId,
      },
    });

    if (!resume || resume.id !== resumeId) {
      return new NextResponse("Resume Not Found", { status: 404 });
    }

    // Delete file from Supabase Storage
    const fileUrl = resume.url;
    const filePath = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

    if (!filePath) {
      return new NextResponse("Resume File Not Found", { status: 404 });
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
    await prisma.resumes.delete({
      where: {
        id: resumeId,
      },
    });

    return new NextResponse("Resume deleted successfully", { status: 200 });
  } catch (error) {
    console.error(`RESUME_DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
