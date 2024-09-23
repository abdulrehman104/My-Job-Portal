"use client";

import queryString from "query-string";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CategoryListItemsProps {
  label: string;
  value: string;
}

export const CategoryListItems = ({ label, value }: CategoryListItemsProps) => {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathName,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true },
    );
    router.push(url);
  };

  return (
    <Button
      variant="outline"
      type="button"
      onClick={onClick}
      className={cn(
        "text-muted-foreground whitespace-nowrap text-sm tracking-wider hover:bg-purple-700 hover:text-white hover:shadow-md",
        isSelected && "bg-purple-700 text-white shadow-md",
      )}
    >
      {label}
    </Button>
  );
};
