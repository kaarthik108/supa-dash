"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";

type PlatformData = {
  platform: string;
  revenue: number;
  impressions: number;
  subscriptions: number;
};

type PlatformTableProps = {
  data: PlatformData[];
};

export const PlatformTable = ({ data }: PlatformTableProps) => {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalImpressions = data.reduce(
    (sum, item) => sum + item.impressions,
    0
  );
  const totalSubscriptions = data.reduce(
    (sum, item) => sum + item.subscriptions,
    0
  );

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  };

  return (
    <div className="h-full overflow-x-auto hide-scrollbar">
      <Table className="h-full text-xs">
        <TableHead>
          <TableRow>
            <TableHeaderCell></TableHeaderCell>
            {data.map((item) => (
              <TableHeaderCell key={item.platform} className="text-right">
                {item.platform}
              </TableHeaderCell>
            ))}
            <TableHeaderCell className="text-right px-2">Total</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Revenue</TableCell>
            {data.map((item) => (
              <TableCell key={item.platform} className="text-right px-2">
                ${formatNumber(item.revenue)}
              </TableCell>
            ))}
            <TableCell className="text-right px-2">
              ${formatNumber(totalRevenue)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Impressions</TableCell>
            {data.map((item) => (
              <TableCell key={item.platform} className="text-right px-2">
                {formatNumber(item.impressions)}
              </TableCell>
            ))}
            <TableCell className="text-right px-2">
              {formatNumber(totalImpressions)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Subscriptions</TableCell>
            {data.map((item) => (
              <TableCell key={item.platform} className="text-right px-2">
                {formatNumber(item.subscriptions)}
              </TableCell>
            ))}
            <TableCell className="text-right px-2">
              {formatNumber(totalSubscriptions)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
