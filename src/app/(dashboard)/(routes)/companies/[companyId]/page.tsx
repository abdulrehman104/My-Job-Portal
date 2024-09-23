import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

import { CustomBreadCrumb } from "@/components/custom-breadcrumb";
import { CompanyDetailPage } from "./company-detail-page";
import { Box } from "@/components/box";
import prisma from "@/lib/prismadb";

interface CompanyPageProps {
  params: { companyId: string };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { userId } = auth();

  const company = await prisma.company.findUnique({
    where: {
      id: params.companyId,
    },
  });

  if (!company || !userId) {
    redirect("/");
  }

  const jobs = await prisma.job.findMany({
    where: {
      companyId: params.companyId,
    },
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      {/* Bread Crumbs */}
      <Box className="my-4 px-2">
        <CustomBreadCrumb
          BreadCrumbPage={company.name}
          BreadCrumbItems={[{ href: "/search", label: "Search" }]}
        />
      </Box>

      {/* Company Cover Image */}
      {company.converImage && (
        <div className="relative -z-10 flex h-80 w-full items-center justify-center overflow-hidden">
          <Image
            src={company.converImage}
            alt={company.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Company Detail Page */}
      <CompanyDetailPage userId={userId} company={company} jobs={jobs} />
    </div>
  );
}
