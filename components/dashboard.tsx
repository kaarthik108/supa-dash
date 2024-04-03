import { SearchParams } from "@/app/dashboard/page";
import { Card, CardContent } from "@/components/ui/card";
import { AudienceCard } from "./AudienceCard";
import { Chat } from "./Chat";
import { ContentCard } from "./ContentCard";
import { EngagementCard } from "./EngagementCard";
import { LocationDonutCharts } from "./LocationDonut";
import { PlatformCard } from "./PlatformCard";
import { BudgetCard } from "./kpi/BudgetCard";
import { ClicksCard } from "./kpi/ClicksCard";
import { ImpressionCard } from "./kpi/ImpressionCard";
import { RevenueCard } from "./kpi/RevenueCard";

export function Dashboard({
  month,
  audience,
  contentType,
  satisfaction,
  location,
}: SearchParams) {
  return (
    <div className="flex h-full w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {/* // kpi cards */}
          <RevenueCard
            month={month}
            audience={audience}
            contentType={contentType}
            satisfaction={satisfaction}
          />
          <BudgetCard
            month={month}
            audience={audience}
            contentType={contentType}
            satisfaction={satisfaction}
          />
          <ImpressionCard
            month={month}
            audience={audience}
            contentType={contentType}
            satisfaction={satisfaction}
          />
          <ClicksCard
            month={month}
            audience={audience}
            contentType={contentType}
            satisfaction={satisfaction}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-8">
            <div className="h-72 sm:h-auto">
              <PlatformCard
                month={month}
                audience={audience}
                contentType={contentType}
                satisfaction={satisfaction}
              />
            </div>
            <div className="h-full w-full shadow-md rounded-md">
              <EngagementCard
                month={month}
                audience={audience}
                contentType={contentType}
              />
            </div>
            <div className="h-full">
              <LocationDonutCharts
                month={month}
                audience={audience}
                contentType={contentType}
                satisfaction={satisfaction}
                location={location}
              />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AudienceCard
                month={month}
                audience={audience}
                contentType={contentType}
                satisfaction={satisfaction}
              />
              <ContentCard
                month={month}
                audience={audience}
                contentType={contentType}
                satisfaction={satisfaction}
              />
            </div>
            <div className="flex-1">
              <Chat />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
