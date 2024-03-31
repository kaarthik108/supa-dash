"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { SocialIcon } from "react-social-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type PlatformData = {
  platform: string;
  revenue: number;
  impressions: number;
  subscriptions: number;
  clicks: number;
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
  const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);

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
              <TableHeaderCell
                key={item.platform}
                className="text-center cursor-pointer text-xs"
              >
                {renderPlatformIcon(item.platform)}
              </TableHeaderCell>
            ))}
            <TableHeaderCell className="text-center px-2">
              Total
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="text-xs md:text-md">
          <TableRow>
            <TableCell>Revenue</TableCell>
            {data.map((item) => (
              <TableCell key={item.platform} className="text-center px-2">
                ${formatNumber(item.revenue)}
              </TableCell>
            ))}
            <TableCell className="text-center px-2">
              ${formatNumber(totalRevenue)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Impressions</TableCell>
            {data.map((item) => (
              <TableCell key={item.platform} className="text-center px-2">
                {formatNumber(item.impressions)}
              </TableCell>
            ))}
            <TableCell className="text-center px-2">
              {formatNumber(totalImpressions)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Subscriptions</TableCell>
            {data.map((item) => (
              <TableCell key={item.platform} className="text-center px-2">
                {formatNumber(item.subscriptions)}
              </TableCell>
            ))}
            <TableCell className="text-center px-2">
              {formatNumber(totalSubscriptions)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Clicks</TableCell>
            {data.map((item) => (
              <TableCell key={item.platform} className="text-center px-2">
                {formatNumber(item.clicks)}
              </TableCell>
            ))}
            <TableCell className="text-center px-2">
              {formatNumber(totalClicks)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const renderPlatformIcon = (platform: string) => {
  switch (platform) {
    case "Instagram":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SocialIcon
                  network="instagram"
                  style={{ height: 18, width: 18 }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Instagram</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case "TikTok":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SocialIcon
                  network="tiktok"
                  style={{ height: 18, width: 18 }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>TikTok</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case "YouTube":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SocialIcon
                  network="youtube"
                  style={{ height: 18, width: 18 }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>YouTube</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case "Facebook":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SocialIcon
                  network="facebook"
                  style={{ height: 18, width: 18 }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Facebook</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case "Blogs":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SocialIcon network="rss" style={{ height: 18, width: 18 }} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Blogs</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    default:
      return null;
  }
};
