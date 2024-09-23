import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { companyId: string } },
) {
  try {
    const { userId } = auth();
    const { companyId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the company by the provided companyId
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    // Check if the user is a follower
    const userIndex = company.followers.indexOf(userId);

    if (userIndex !== -1) {
      // Remove the follower by updating the followers array
      const companyData = await prisma.company.update({
        where: {
          id: companyId,
        },
        data: {
          followers: {
            set: company.followers.filter(
              (followerId) => followerId !== userId,
            ),
          },
        },
      });

      return new NextResponse(JSON.stringify(companyData), {
        status: 200,
      });
    } else {
      return new NextResponse("User not found in the followers", {
        status: 404,
      });
    }
  } catch (error) {
    console.error(`COMPANY_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
