import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function CardSkeleton({ height = 52 }) {
  return (
    <Card className="h-52 bg-[#f0eee6]/80">
      <Skeleton className="h-full w-full" />
    </Card>
  );
}

const AudienceComp = dynamic(
  () => import("./AudienceCard").then((mod) => mod.AudienceCard),
  {
    ssr: false,
    loading: () => <CardSkeleton />,
  }
);

const ContentComp = dynamic(
  () => import("./ContentCard").then((mod) => mod.ContentCard),
  {
    ssr: false,
    loading: () => <CardSkeleton />,
  }
);

const EngagementComp = dynamic(
  () => import("./EngagementCard").then((mod) => mod.EngagementCard),
  {
    ssr: false,
    loading: () => <CardSkeleton />,
  }
);

const LocationComp = dynamic(
  () => import("./LocationDonut").then((mod) => mod.LocationCard),
  {
    ssr: false,
    loading: () => <CardSkeleton />,
  }
);

const PlatformComp = dynamic(
  () => import("./PlatformCard").then((mod) => mod.PlatformCard),
  {
    ssr: false,
    loading: () => <CardSkeleton />,
  }
);

export {
  AudienceComp,
  ContentComp,
  EngagementComp,
  LocationComp,
  PlatformComp,
};
