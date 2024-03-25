"use client";
import {
  MultiSelect,
  MultiSelectItem,
  SearchSelect,
  SearchSelectItem,
  Select,
  SelectItem,
} from "@tremor/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type MonthFilterProps = {
  selectedMonth: string;
};

export function MonthFilter({ selectedMonth }: MonthFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleMonthChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("month", value);
      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div>
      <SearchSelect value={selectedMonth} onValueChange={handleMonthChange}>
        <SearchSelectItem value="all">All Months</SearchSelectItem>
        {months.map((month) => (
          <SearchSelectItem key={month} value={month}>
            {month}
          </SearchSelectItem>
        ))}
      </SearchSelect>
    </div>
  );
}

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
  "Nov",
  "Dec",
];
