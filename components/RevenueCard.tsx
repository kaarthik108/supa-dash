// components/RevenueCard.tsx
import { fetchRevenueData } from "@/app/actions";
import { groupByMonth } from "@/lib/utils";
import { RevenueOverTime } from "./charts/sparkChart";

export async function RevenueCard() {
  const revenueData = await fetchRevenueData();
  const formattedData = revenueData ? groupByMonth(revenueData) : [];
  console.log(formattedData);
  return <RevenueOverTime chartData={formattedData} />;
}
