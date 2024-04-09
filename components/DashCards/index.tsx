import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { AudienceCard } from "./AudienceCard";
import { ContentCard } from "./ContentCard";
import { EngagementCard } from "./EngagementCard";
import { LocationCard } from "./LocationDonut";
import { PlatformCard } from "./PlatformCard";

export function CardSkeleton({ height = 52 }) {
  return (
    <Card className="h-52">
      <Skeleton className="h-full w-full" />
    </Card>
  );
}

export {
  AudienceCard as AudienceComp,
  ContentCard as ContentComp,
  EngagementCard as EngagementComp,
  LocationCard as LocationComp,
  PlatformCard as PlatformComp,
};
