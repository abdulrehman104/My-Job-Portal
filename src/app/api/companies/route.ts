import prisma from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { name } = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Company name is missing", { status: 401 });
    }

    const companyData = await prisma.company.create({
      data: {
        userId,
        name,
      },
    });

    return NextResponse.json(companyData);
  } catch (error) {
    console.error(`COMPANY_POST: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
