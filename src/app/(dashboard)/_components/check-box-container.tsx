import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface AppliedFilter {
  label: string;
  value: string;
  isChecked?: boolean;
}

interface CheckBoxContainerProps {
  data: AppliedFilter[];
  onChange: (dataValues: string[]) => void;
}

export const CheckBoxContainer = ({
  data,
  onChange,
}: CheckBoxContainerProps) => {
  const [filter, setFilter] = useState<AppliedFilter[]>(data);

  useEffect(() => {
    setFilter(data);
  }, [data]);

  const handleCheckedChange = (applied: AppliedFilter) => {
    const updatedFilter = filter.map((item) => {
      if (item.value === applied.value) {
        return {
          ...item,
          isChecked: !item.isChecked,
        };
      }
      return item;
    });

    setFilter(updatedFilter); // Update state with the new filter

    // Pass the updated list of checked values to the parent component
    onChange(
      updatedFilter.filter((item) => item.isChecked).map((item) => item.value),
    );
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-2">
      {filter.map((item) => (
        <div
          key={item.value}
          className={cn(
            "flex items-center gap-x-2",
            item.isChecked ? "text-purple-500" : "text-muted-foreground",
          )}
        >
          <Checkbox
            checked={item.isChecked || false} // Ensure it’s either true or false
            onCheckedChange={() => handleCheckedChange(item)} // Handle state change
          />
          {item.label}
        </div>
      ))}
    </div>
  );
};
