"use client";

import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * FilterByDate Component
 *
 * This component allows users to filter job listings by date using a dropdown.
 * It provides predefined date ranges such as "Today", "Yesterday", "This Week", etc.,
 * and updates the URL query parameters to reflect the selected filter.
 *
 * The component uses `next/navigation` for client-side navigation
 * and `query-string` for query parameter manipulation.
 */
export const FilterByDate = () => {
  const router = useRouter(); // To handle navigation
  const pathName = usePathname(); // Get the current route path

  // Predefined date filter options
  const filterDates = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "thisWeek" },
    { label: "Last Week", value: "lastWeek" },
    { label: "Last Month", value: "last-month" },
  ];

  /**
   * Handles the change event when the user selects a filter option.
   * It updates the URL query string with the selected date filter and pushes the new URL.
   *
   * @param {string} value - The selected date filter value (e.g., 'today', 'thisWeek').
   */
  const onChange = (value: string) => {
    const currentQueryParams = queryString.parseUrl(window.location.href).query; // Get existing query params
    const updatedQueryString = {
      ...currentQueryParams,
      createdAtFilter: value, // Update with selected date filter
    };

    // Construct the new URL with updated query params
    const url = queryString.stringifyUrl({
      url: pathName,
      query: updatedQueryString,
    });

    router.push(url); // Navigate to the new URL
  };

  return (
    <Select onValueChange={(value) => onChange(value)}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter by Date" />
      </SelectTrigger>
      <SelectContent>
        {filterDates.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
