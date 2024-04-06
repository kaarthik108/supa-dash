import { SearchParams } from "@/app/dashboard/page";
import { Suspense } from "react";
import { Chat } from "./Chat";
import {
  AudienceCard,
  CardSkeleton,
  ContentCard,
  EngagementCard,
  LocationCard,
  PlatformCard,
} from "./DashCards";

import {
  BudgetCard,
  ClicksCard,
  ImpressionCard,
  RevenueCard,
  SubscriberCard,
} from "./kpi";

export function Dashboard({
  month,
  audience,
  contentType,
  satisfaction,
  location,
  age,
}: SearchParams) {
  console.log("Dashboard", age);
  return (
    <div className="flex h-full w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-8">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <Suspense fallback={<CardSkeleton />}>
            <RevenueCard {...{ month, audience, contentType, satisfaction }} />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <BudgetCard {...{ month, audience, contentType, satisfaction }} />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <ImpressionCard
              {...{ month, audience, contentType, satisfaction }}
            />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <ClicksCard {...{ month, audience, contentType, satisfaction }} />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <SubscriberCard
              {...{ month, audience, contentType, satisfaction }}
            />
          </Suspense>
        </div>
        <div className="flex flex-col gap-8 sm:grid lg:grid-cols-2 sm:gap-8">
          <div className="flex flex-col gap-8">
            <div className="h-auto shadow-md">
              <Suspense fallback={<CardSkeleton />}>
                <PlatformCard
                  {...{ month, audience, contentType, satisfaction }}
                />
              </Suspense>
            </div>
            <div className="shadow-md rounded-md">
              <Suspense fallback={<CardSkeleton />}>
                <EngagementCard
                  {...{ month, audience, contentType, satisfaction }}
                />
              </Suspense>
            </div>
            <Suspense fallback={<CardSkeleton />}>
              <LocationCard
                {...{ month, audience, contentType, satisfaction, location }}
              />
            </Suspense>
          </div>
          <div className="flex flex-col gap-8">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Suspense fallback={<CardSkeleton />}>
                <AudienceCard
                  {...{
                    month,
                    audience,
                    contentType,
                    satisfaction,
                    location,
                    age,
                  }}
                />
              </Suspense>
              <Suspense fallback={<CardSkeleton />}>
                <ContentCard
                  {...{ month, audience, contentType, satisfaction }}
                />
              </Suspense>
            </div>
            <div className="flex-1 min-h-[840px]">
              <Suspense fallback>
                <Chat />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
