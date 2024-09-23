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
    const updatedValues = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("companyId is missing", { status: 400 });
    }

    if (!updatedValues) {
      return new NextResponse("Updated values are missing", { status: 400 });
    }

    const companyData = await prisma.company.update({
      where: {
        id: companyId,
        userId,
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(companyData);
  } catch (error) {
    console.error(`COMPANY_UPDATE: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
