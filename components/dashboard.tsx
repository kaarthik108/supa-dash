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
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-8">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <RevenueCard {...{ month, audience, contentType, satisfaction }} />
          <BudgetCard {...{ month, audience, contentType, satisfaction }} />
          <ImpressionCard {...{ month, audience, contentType, satisfaction }} />
          <ClicksCard {...{ month, audience, contentType, satisfaction }} />
          <SubscriberCard {...{ month, audience, contentType, satisfaction }} />
        </div>
        <div className="flex flex-col gap-8 sm:grid lg:grid-cols-2 sm:gap-8">
          <div className="flex flex-col gap-8">
            <div className="h-auto shadow-md">
              <PlatformCard
                {...{ month, audience, contentType, satisfaction }}
              />
            </div>
            <div className="shadow-md rounded-md">
              <EngagementCard
                {...{ month, audience, contentType, satisfaction }}
              />
            </div>
            <LocationDonutCharts
              {...{ month, audience, contentType, satisfaction, location }}
            />
          </div>
          <div className="flex flex-col gap-8">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <AudienceCard
                {...{ month, audience, contentType, satisfaction }}
              />
              <ContentCard
                {...{ month, audience, contentType, satisfaction }}
              />
            </div>
            <div className="flex-1 min-h-[840px]">
              <Chat />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
