"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ListItemProps {
  item: any;
  onSelect: (item: any) => void;
  isChecked: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  item,
  onSelect,
  isChecked,
}) => {
  return (
    <div
      className="flex cursor-pointer items-center px-2 py-1"
      onClick={() => onSelect(item)}
    >
      <Check
        className={cn("mr-2 size-4", isChecked ? "opacity-100" : "opacity-0")}
      />
      <p className="w-full truncate whitespace-nowrap text-sm">{item.label}</p>
    </div>
  );
};
