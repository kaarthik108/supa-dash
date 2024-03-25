import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupByMonth(
  data: { Revenue: number | null; StartDate: string | null }[]
) {
  const groupedData: { [month: string]: number } = {};
  console.log(data);
  data.forEach((item) => {
    if (item.StartDate && item.Revenue) {
      const month = formatDate(item.StartDate);
      if (month !== "Invalid Date") {
        if (groupedData[month]) {
          groupedData[month] += item.Revenue;
        } else {
          groupedData[month] = item.Revenue;
        }
      }
    }
  });

  return Object.entries(groupedData)
    .map(([month, revenue]) => ({
      month,
      revenue,
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
