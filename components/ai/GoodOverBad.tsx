import { GoodOverBadCampaign } from "@/app/actions/ai";
import React from "react";
import { TableChartComponent } from "../llm-charts/TableChartComponent";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export async function GoodOverBad() {
  const data = await GoodOverBadCampaign();

  return (
    <Card className="max-w-md sm:max-w-full w-full">
      <CardHeader>
        <CardTitle>Good Vs Bad Campaign</CardTitle>
        <p className="text-sm text-gray-500 mt-2">
          {`This analysis categorizes each campaign as 'Good' or 'Bad' based on its performance across key metrics—impressions, clicks, new subscriptions, and revenue—relative to the average performance of all campaigns. A 'Good Campaign' exceeds the average in all these areas, indicating a higher return on investment and overall effectiveness`}
        </p>
      </CardHeader>
      <CardContent className="max-w-md flex items-center justify-center">
        <TableChartComponent queryResult={data} title="Good Vs Bad Campaign" />
      </CardContent>
    </Card>
  );
}
