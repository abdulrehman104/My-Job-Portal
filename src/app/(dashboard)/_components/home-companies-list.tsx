"use client";

import { Company } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Box } from "@/components/box";
import { Card } from "@/components/ui/card";

interface HomeCompaniesListProps {
  companies: Company[];
}

const CompanyListItemCard = ({ company }: { company: Company }) => {
  const router = useRouter();

  return (
    <Card
      className="text-muted-foreground flex cursor-pointer items-center gap-2 p-4 hover:border-purple-500 hover:text-purple-500 hover:shadow-md"
      onClick={() => router.push(`/companies/${company.id}`)}
    >
      <h2 className="whitespace-nowrap font-serif font-semibold tracking-wide">
        {company.name}
      </h2>
    </Card>
  );
};
export const HomeCompaniesList = ({ companies }: HomeCompaniesListProps) => {
  return (
    <Box className="my-12 flex-col">
      <h2 className="font-sans text-2xl font-bold tracking-wider">
        Featured companies actively hiring
      </h2>
      <div className="mt-12 flex w-full flex-wrap items-center justify-center gap-x-4">
        {companies.map((item) => (
          <CompanyListItemCard company={item} key={item.id} />
        ))}
      </div>
    </Box>
  );
};
