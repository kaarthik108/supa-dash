import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupByField(
  data: any[],
  groupField: string,
  valueField: string
): { month: string; revenue: number | null }[] {
  const groupedData: { [key: string]: number } = {};

  data.forEach((item) => {
    const groupValue = item[groupField];
    const value = item[valueField];

    if (groupValue && typeof value === "number") {
      const formattedGroupValue = formatDate(groupValue.toString());

      if (formattedGroupValue !== "Invalid Date") {
        if (groupedData[formattedGroupValue]) {
          groupedData[formattedGroupValue] += value;
        } else {
          groupedData[formattedGroupValue] = value;
        }
      }
    }
  });

  return Object.entries(groupedData)
    .map(([month, revenue]) => ({
      month,
      revenue: revenue || null,
    }))
    .sort((a, b) => {
      const monthA = new Date(a.month);
      const monthB = new Date(b.month);
      return monthA.getTime() - monthB.getTime();
    });
}

function formatDate(dateString: string) {
  const dateParts = dateString.split(".");
  if (dateParts.length !== 3) {
    return "Invalid Date";
  }

  const [day, month, year] = dateParts;
  const formattedDate = new Date(`${month}.${day}.${year}`);

  if (isNaN(formattedDate.getTime())) {
    return "Invalid Date";
  }

  const formattedMonth = formattedDate.toLocaleString("default", {
    month: "short",
  });
  const formattedYear = formattedDate.getFullYear().toString().slice(-2);
  return `${formattedMonth} ${formattedYear}`;
}
