"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface SProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarRouteItems = ({ icon: Icon, label, href }: SProps) => {
  const pathName = usePathname();
  const router = useRouter();

  const isActive =
    (pathName === "/" && href === "/") ||
    pathName === href ||
    pathName.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 pl-6 text-sm font-[500] text-neutral-500 transition-all hover:bg-neutral-300/20 hover:text-neutral-600",
        isActive &&
          "/20 bg-purple-200  text-purple-700 hover:bg-purple-200/20 hover:text-purple-700",
      )}
    >
      <Link href={href} className="flex items-center gap-x-3 p-4">
        <Icon />
        {label}
      </Link>

      <div
        className={cn(
          "ml-auto h-full  border-2 text-neutral-500 opacity-0 transition-all",
          isActive && "border-purple-700 opacity-100 ",
        )}
      ></div>
    </button>
  );
};
