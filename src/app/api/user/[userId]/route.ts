import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function PATCH(req: Request) {
  try {
    const { userId } = auth();
    const value = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!value) {
      return new NextResponse("values are missing", { status: 400 });
    }

    const profile = await prisma.userProfile.findUnique({
      where: {
        userId: userId,
      },
    });

    let updatedProfile;

    if (profile) {
      updatedProfile = await prisma.userProfile.update({
        where: {
          userId,
        },
        data: {
          ...value,
        },
      });
    } else {
      updatedProfile = await prisma.userProfile.create({
        data: {
          userId,
          ...value,
        },
      });
    }

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error(`JOB_UPDATE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
