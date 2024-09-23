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
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const updateData = {
      followers: company.followers ? { push: userId } : { userId },
    };

    const companyData = await prisma.company.update({
      where: {
        id: companyId,
        userId,
      },
      data: updateData,
    });

    return NextResponse.json(companyData);
  } catch (error) {
    console.error(`COMPANY_PATCH: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
