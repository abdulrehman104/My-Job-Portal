import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns, CompanyColumns } from "./_components/columns";
import prisma from "@/lib/prismadb";

export default async function Companies() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const companies = await prisma.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedData: CompanyColumns[] = companies.map((company) => ({
    id: company.id,
    logo: company.logo ? company.logo : "",
    name: company.name ? company.name : "",
    createdAt: company.createdAt
      ? format(company.createdAt, "MMMM do , yyyy")
      : "N/A",
  }));

  return (
    <div className="p-6">
      <div className="flex items-end justify-end">
        <Link href="/admin/companies/create">
          <Button>New Company</Button>
        </Link>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={formatedData} searchKey="name" />
      </div>
    </div>
  );
}
