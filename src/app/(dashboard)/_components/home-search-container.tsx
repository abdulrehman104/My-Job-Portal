"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import queryString from "query-string";

import { Box } from "@/components/box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const HomeSearchContainer = () => {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const handleClick = () => {
    const href = queryString.stringifyUrl({
      url: "/search",
      query: { title: title || undefined },
    });

    router.push(href);
  };

  return (
    <div className="mt-8 hidden w-full items-center justify-center px-4 md:flex">
      <Box className="text-muted-foreground h-16 w-3/4 gap-3 rounded-full bg-neutral-50 p-4 px-12 shadow-lg">
        <Input
          placeholder="Search by job name..."
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-w-72 flex-1 border-none bg-transparent font-sans text-lg outline-none focus:border-none focus:outline-none"
        />
        <Button
          onClick={handleClick}
          disabled={!title}
          className="bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-0" // Focus ring removed
          size="icon"
        >
          <SearchIcon className="size-5 min-w-5" />
        </Button>
      </Box>
    </div>
  );
};
