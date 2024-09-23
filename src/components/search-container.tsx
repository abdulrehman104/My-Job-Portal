"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { useDebounce } from "@/hooks/use-debounced";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

export const SearchContainer = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const currenttitle = searchParams.get("title");
  const currentCategoryId = searchParams.get("categoryId");
  const currentCreatedAtFilter = searchParams.get("createdAtFilter");
  const currentShiftTiming = searchParams.get("shiftTiming");
  const currentWorkMode = searchParams.get("workMode");
  const currentYearsOfExperience = searchParams.get("yearsOfExperience");

  const [value, setValue] = useState(currenttitle || "");

  const debounceTitle = useDebounce(value);

  useEffect(() => {
    const url = queryString.stringifyUrl(
      {
        url: pathName,
        query: {
          title: debounceTitle,
          categoryId: currentCategoryId,
          createdAtFilter: currentCreatedAtFilter,
          shiftTiming: currentShiftTiming,
          workMode: currentWorkMode,
          yearsOfExperience: currentYearsOfExperience,
        },
      },
      { skipEmptyString: true, skipNull: true },
    );

    router.push(url);
  }, [
    debounceTitle,
    currentCategoryId,
    currentCreatedAtFilter,
    currentShiftTiming,
    currentWorkMode,
    currentYearsOfExperience,
  ]);

  return (
    <div className="relative flex items-center gap-x-2 ">
      <Search className="absolute left-3 size-4 text-neutral-500" />

      <Input
        placeholder="Seacrh for a job"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-md bg-purple-50 pl-9 text-sm focus-visible:ring-purple-200/80"
      />

      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 "
          onClick={() => setValue("")}
        >
          <X className="size-4 text-neutral-500" />
        </Button>
      )}
    </div>
  );
};
