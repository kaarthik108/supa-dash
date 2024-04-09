"use client";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
  ROI: number;
  CPA: number;
  CTR: number;
  ConversionRate: number;
};

type PlatformTableProps = {
  data: PlatformData[];
};

export const PlatformTable = ({ data }: PlatformTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clickedPlatform, setClickedPlatform] = useState<string | null>(null);

  useEffect(() => {
    const currentPlatform = searchParams.get("platform");
    setClickedPlatform(currentPlatform);
  }, [searchParams]);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  };

  const handlePlatformClick = useCallback(
    (platform: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (clickedPlatform === platform) {
        params.delete("platform");
        setClickedPlatform(null);
      } else {
        params.set("platform", platform);
        setClickedPlatform(platform);
      }
      router.push(`/dashboard?${params.toString()}`, { scroll: false });
      router.refresh();
    },
    [router, searchParams, clickedPlatform]
  );

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
                <div
                  className="cursor-pointer"
                  onClick={() => handlePlatformClick(item.platform)}
                >
                  {renderPlatformIcon(item.platform)}
                </div>
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className="text-xs md:text-md">
          <TableRow>
            <TableCell>Revenue</TableCell>
            {data.map((item) => (
              <TableCell key={item.platform} className="text-center px-2">
                <Badge color={item.revenue < 0 ? "red" : "teal-600"}>
                  ${formatNumber(item.revenue)}
                </Badge>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Return on Investment (ROI)</TableCell>
            {data.map((item) => (
              <TableCell key={item.platform} className="text-center px-2">
                <Badge color={item.ROI < 0 ? "red" : "teal-600"}>
                  {formatNumber(item.ROI)}%
                </Badge>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Cost per Acquisition (CPA)</TableCell>
            {data.map((item) => (
              <TableCell key={item.platform} className="text-center px-2">
                <Badge color={item.CPA < 0 ? "red" : "teal-600"}>
                  {formatNumber(item.CPA)}%
                </Badge>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Click Through Rate (CTR)</TableCell>
            {data.map((item) => (
              <TableCell key={item.platform} className="text-center px-2">
                <Badge color={item.CTR < 0 ? "red" : "teal-600"}>
                  {formatNumber(item.CTR)}%
                </Badge>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>ConversionRate</TableCell>
            {data.map((item) => (
              <TableCell key={item.platform} className="text-center px-2">
                <Badge color={item.ConversionRate < 0 ? "red" : "teal-600"}>
                  {formatNumber(item.ConversionRate)}%
                </Badge>
              </TableCell>
            ))}
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
