"use client";

import {
  BookMarked,
  Compass,
  Home,
  Building2,
  User,
  Layers,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";

import { SidebarRouteItems } from "./SidebarRouteItems";
import { Separator } from "@/components/ui/separator";
import { FilterByDate } from "./filter-by-date";
import { CheckBoxContainer } from "./check-box-container";
import { Box } from "@/components/box";

/**
 * SidebarRoutes component renders the sidebar for both admin and client users.
 * It adjusts based on the current URL path and displays specific routes for
 * admin or client. Additionally, filters for search functionality are shown
 * when the path matches a search route.
 */
export const SidebarRoutes = () => {
  const pathName = usePathname();
  const router = useRouter();

  // Routes available for admin users
  const adminRoutes = [
    {
      icon: Layers,
      label: "Jobs",
      href: "/admin/jobs",
    },
    {
      icon: Building2,
      label: "Companies",
      href: "/admin/companies",
    },
    {
      icon: Compass,
      label: "Analytics",
      href: "/admin/analytics",
    },
  ];

  // Routes available for regular client users
  const clientRoutes = [
    {
      icon: Home,
      label: "Home",
      href: "/",
    },
    {
      icon: Compass,
      label: "Search",
      href: "/search",
    },
    {
      icon: User,
      label: "Profile",
      href: "/user",
    },
    {
      icon: BookMarked,
      label: "Saved Jobs",
      href: "/savedJobs",
    },
  ];

  // Determine if the current path is for admin or client users
  const isAdmin = pathName.startsWith("/admin");
  const isSearch = pathName.startsWith("/search");
  const routes = isAdmin ? adminRoutes : clientRoutes;

  // Data for Shift Time filter
  const shiftTimeDate = [
    { label: "Remote", value: "remote" },
    { label: "Hybrid", value: "hybrid" },
    { label: "Office", value: "office" },
  ];

  // Data for Working Mode filter
  const workingModeData = [
    { label: "Full Time", value: "full-time" },
    { label: "Part Time", value: "part-time" },
    { label: "Contract", value: "contract" },
  ];

  // Data for Experience filter
  const experienceData = [
    { label: "Fresher", value: "0" },
    { label: "O-2 Years", value: "2" },
    { label: "0-4 Years", value: "3" },
    { label: "5+ Years", value: "5" },
  ];

  /**
   * Handles the change in shift time filter, updates the query parameters
   * and navigates the user to the updated URL with the new filters.
   * @param {Array} workModeChanges - Array of selected shift time filters.
   */
  const handleWorkModeChange = (workModeChanges: any[]) => {
    const currentQueryParameter = queryString.parseUrl(
      window.location.href,
    ).query;

    const updatedQueryParameters = {
      ...currentQueryParameter,
      workMode: workModeChanges,
    };

    // Stringify URL with updated query parameters and route to the updated URL
    const url = queryString.stringifyUrl(
      {
        url: pathName,
        query: updatedQueryParameters,
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  const handleShiftTimeChange = (shiftTimeChanges: any[]) => {
    const currentQueryParameter = queryString.parseUrl(
      window.location.href,
    ).query;

    const updatedQueryParameters = {
      ...currentQueryParameter,
      shiftTiming: shiftTimeChanges,
    };

    // Stringify URL with updated query parameters and route to the updated URL
    const url = queryString.stringifyUrl(
      {
        url: pathName,
        query: updatedQueryParameters,
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  const handleExperienceChange = (yearsOfExperienceChanges: any[]) => {
    const currentQueryParameter = queryString.parseUrl(
      window.location.href,
    ).query;

    const updatedQueryParameters = {
      ...currentQueryParameter,
      yearsOfExperience: yearsOfExperienceChanges,
    };

    // Stringify URL with updated query parameters and route to the updated URL
    const url = queryString.stringifyUrl(
      {
        url: pathName,
        query: updatedQueryParameters,
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  return (
    <>
      {/* Display routes based on user type */}
      {routes.map((route) => (
        <SidebarRouteItems
          key={route.href}
          icon={route.icon}
          href={route.href}
          label={route.label}
        />
      ))}

      {isSearch && (
        <Box className="flex flex-col items-start justify-start space-y-4 px-6 py-4 ">
          <Separator />

          <h2 className="text-muted-foreground text-lg tracking-wide">
            Filters
          </h2>
          {/* Filter By Date */}
          <FilterByDate />

          <Separator />

          <h2 className="text-muted-foreground text-lg tracking-wide">
            Working Mode
          </h2>
          {/* Filter By Shift Time */}
          <CheckBoxContainer
            data={shiftTimeDate}
            onChange={handleWorkModeChange}
          />

          <Separator />
          <h2 className="text-muted-foreground text-lg tracking-wide">
            Shift Time
          </h2>
          {/* Filter By Working Mode */}
          <CheckBoxContainer
            data={workingModeData}
            onChange={handleShiftTimeChange}
          />

          <Separator />
          <h2 className="text-muted-foreground text-lg tracking-wide">
            Experience
          </h2>
          {/* Filter By Experience */}
          <CheckBoxContainer
            data={experienceData}
            onChange={handleExperienceChange}
          />
        </Box>
      )}
    </>
  );
};
