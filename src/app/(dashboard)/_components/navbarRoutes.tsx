"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { SearchContainer } from "@/components/search-container";

export const NavbarRoutes = () => {
  const pathName = usePathname();

  const isAdmin = pathName.startsWith("/admin");
  const isPlayer = pathName.startsWith("/job");
  const isSearch = pathName.startsWith("/search");

  return (
    <>
      {/* Job Search Bar */}
      {isSearch && (
        <div className="hidden w-[89%] pl-52 md:flex">
          <div className="w-full pr-4">
            <SearchContainer />
          </div>
        </div>
      )}

      {/* Move to Admin mode */}
      <div className="ml-auto flex gap-x-2">
        {isAdmin || isPlayer ? (
          <Link
            href="/"
            className="flex items-center justify-center rounded-md border border-purple-700/20 px-3 py-2 text-sm"
          >
            <LogOut className="mr-2 size-4" />
            Exit
          </Link>
        ) : (
          <>
            <Link
              href="/admin/jobs"
              className="flex items-center justify-center rounded-md border border-purple-700/20 px-3 py-2 text-sm "
            >
              Admin Mode
            </Link>
          </>
        )}

        {/* User Button */}
        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </>
  );
};
