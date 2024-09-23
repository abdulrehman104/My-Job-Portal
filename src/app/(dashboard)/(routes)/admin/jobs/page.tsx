import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns, JobColumns } from "./_components/columns";
import prisma from "@/lib/prismadb";

export default async function Jobs() {
  const { userId } = auth();

  console.log("userId", userId);

  if (!userId) {
    return redirect("/");
  }

  const jobs = await prisma.job.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
      company: true,
      attachments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedData: JobColumns[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company ? job.company?.name : "",
    category: job.category?.name ? job.category?.name : "N/A",
    isPublished: job.isPublished,
    createdAt: job.createdAt ? format(job.createdAt, "MMMM do , yyyy") : "N/A",
  }));

  return (
    <div className="p-6">
      <div className="flex items-end justify-end">
        <Link href="/admin/create">
          <Button>New Job</Button>
        </Link>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={formatedData} searchKey="title" />
      </div>
    </div>
  );
}
