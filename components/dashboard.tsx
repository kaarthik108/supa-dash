import { SearchParams } from "@/app/dashboard/page";
import { AudienceCard } from "./AudienceCard";
import { Chat } from "./Chat";
import { ContentCard } from "./ContentCard";
import { EngagementCard } from "./EngagementCard";
import { LocationDonutCharts } from "./LocationDonut";
import { PlatformCard } from "./PlatformCard";
import { SubsOverTimeCard } from "./ai/SubsOverTime";
import { BudgetCard } from "./kpi/BudgetCard";
import { ClicksCard } from "./kpi/ClicksCard";
import { ImpressionCard } from "./kpi/ImpressionCard";
import { RevenueCard } from "./kpi/RevenueCard";
import { SubscriberCard } from "./kpi/SubscriberCard";

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
        <div className="grid gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-5">
          {/* // kpi cards */}
          <RevenueCard {...{ month, audience, contentType, satisfaction }} />
          <BudgetCard {...{ month, audience, contentType, satisfaction }} />
          <ImpressionCard {...{ month, audience, contentType, satisfaction }} />
          <ClicksCard {...{ month, audience, contentType, satisfaction }} />
          <SubscriberCard {...{ month, audience, contentType, satisfaction }} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-8">
            <div className="h-72 sm:h-auto">
              <PlatformCard
                {...{ month, audience, contentType, satisfaction }}
              />
            </div>
            <div className="h-full w-full shadow-md rounded-md">
              <EngagementCard
                {...{ month, audience, contentType, satisfaction }}
              />
            </div>
            <div className="h-full">
              <LocationDonutCharts
                {...{ month, audience, contentType, satisfaction, location }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <AudienceCard
                {...{ month, audience, contentType, satisfaction }}
              />
              <ContentCard
                {...{ month, audience, contentType, satisfaction }}
              />
            </div>
            <div className="flex-1">
              <Chat />
            </div>
          </div>
        </div>
        <SubsOverTimeCard {...{ month, audience, contentType, satisfaction }} />
      </main>
    </div>
  );
}
