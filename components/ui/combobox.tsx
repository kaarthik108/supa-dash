"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useCallback } from "react";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
];

export function MonthFilter() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedMonth = searchParams.get("month") || "all";

  const handleMonthChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("month", value);
      router.push(`/dashboard?${params.toString()}`);
      setOpen(false);
    },
    [router, searchParams]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedMonth === "all"
            ? "All Months"
            : months.find((month) => month === selectedMonth)}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Filter by Month"
            className="h-9 focus:outline-none focus:ring-0 border-none"
          />
          <CommandEmpty>No Month found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              key="all"
              value="all"
              onSelect={() => handleMonthChange("all")}
              className="cursor-pointer"
            >
              All Months
              <CheckIcon
                className={cn(
                  "ml-auto h-4 w-4",
                  selectedMonth === "all" ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
            {months.map((month) => (
              <CommandItem
                key={month}
                value={month}
                onSelect={() => handleMonthChange(month)}
                className="cursor-pointer"
              >
                {month}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedMonth === month ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
