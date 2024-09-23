"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ListItem } from "./List-item";

interface ComboboxProps {
  heading: string;
  value?: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export function Combobox({ heading, value, options, onChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filtered, setFiltered] = React.useState<
    { label: string; value: string }[]
  >([]);

  const handleSearchTerm = () => {};

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select a option..."}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <div className="flex w-full items-center rounded-md border px-2 py-1">
            <Search className="mr-2 size-4 min-w-4" />

            <input
              type="text"
              placeholder="Search category"
              onChange={handleSearchTerm}
              className="w-full flex-1 py-1 text-sm outline-none"
            />
          </div>
          <CommandList>
            <CommandGroup heading={heading}>
              {searchTerm === "" ? (
                options.map((option) => (
                  <ListItem
                    key={option.value}
                    item={option}
                    onSelect={() => {
                      onChange(option.value === value ? "" : option.value);
                      setOpen(false);
                    }}
                    isChecked={option?.value === value}
                  />
                ))
              ) : filtered.length > 0 ? (
                filtered.map((option) => (
                  <ListItem
                    key={option.value}
                    item={option}
                    onSelect={() => {
                      onChange(option.value === value ? "" : option.value);
                      setOpen(false);
                    }}
                    isChecked={option?.value === value}
                  />
                ))
              ) : (
                <CommandEmpty>No Category Found</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
