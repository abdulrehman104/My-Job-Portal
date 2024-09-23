"use client";

import { Category } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import queryString from "query-string";

import { Box } from "@/components/box";
import { Card } from "@/components/ui/card";
import { iconMapping, IconName } from "@/lib/utils";

interface HomescreenCategoriesContainerProps {
  categories: Category[];
}

export const Icon = ({ name }: { name: IconName }) => {
  const IconComponent = iconMapping[name];
  return IconComponent ? <IconComponent className="size-5" /> : null;
};

export const CategoryListItemCard = ({ data }: { data: Category }) => {
  const router = useRouter();

  const handleClick = (categoryId: string) => {
    const href = queryString.stringifyUrl({
      url: "/search",
      query: { categoryId: categoryId || undefined },
    });

    router.push(href);
  };

  return (
    <Card
      className="text-muted-foreground flex cursor-pointer items-center gap-2 p-2 hover:border-purple-500 hover:text-purple-500 hover:shadow-md"
      onClick={() => handleClick(data.id)}
    >
      <Icon name={data.name as IconName} />
      <span className="w-28 truncate whitespace-nowrap">{data.name}</span>
      <ChevronRight className="size-4" />
    </Card>
  );
};

export const HomescreenCategoriesContainer = ({
  categories,
}: HomescreenCategoriesContainerProps) => {
  return (
    <Box className="mt-12 flex-col">
      <div className="flex w-full flex-wrap items-center justify-center gap-4">
        {categories.map((item) => (
          <CategoryListItemCard key={item.id} data={item} />
        ))}
      </div>
    </Box>
  );
};
