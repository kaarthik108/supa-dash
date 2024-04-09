import { Suspense } from "react";
import { Chat } from "./Chat";
import {
  AudienceComp,
  CardSkeleton,
  ContentComp,
  EngagementComp,
  LocationComp,
  PlatformComp,
} from "./DashCards";

import {
  BudgetCard,
  ClicksCard,
  ImpressionCard,
  RevenueCard,
  SubscriberCard,
} from "./kpi";

export async function Dashboard({
  RevenueData,
  BudgetData,
  ImpressionData,
  ClicksData,
  SubsData,
  AudienceData,
  ContentData,
  subscribersByLocation,
  ageDistributionByLocation,
  EngagementData,
  location,
  PlatformData,
}: {
  RevenueData: any;
  BudgetData: any;
  ImpressionData: any;
  ClicksData: any;
  SubsData: any;
  AudienceData: any;
  ContentData: any;
  subscribersByLocation: any;
  ageDistributionByLocation: any;
  EngagementData: any;
  location: any;
  PlatformData: any;
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-8">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          <Suspense fallback={<CardSkeleton />}>
            <RevenueCard rawData={RevenueData} />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <BudgetCard rawData={BudgetData} />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <ImpressionCard rawData={ImpressionData} />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <ClicksCard rawData={ClicksData} />
          </Suspense>
          <Suspense fallback={<CardSkeleton />}>
            <SubscriberCard rawData={SubsData} />
          </Suspense>
        </div>
        <div className="flex flex-col gap-4 sm:grid md:grid lg:grid-cols-2 lg:row-span-1 h-auto">
          <div className="flex flex-col gap-4 h-auto">
            <div className="h-auto shadow-2xl border-none rounded-md ">
              <Suspense fallback={<CardSkeleton />}>
                <PlatformComp rawData={PlatformData} />
              </Suspense>
            </div>
            <div className="h-auto border-none rounded-md ">
              <Suspense fallback={<CardSkeleton />}>
                <LocationComp
                  subscribersByLocation={subscribersByLocation}
                  ageDistributionByLocation={ageDistributionByLocation}
                  location={location || null}
                />
              </Suspense>
            </div>
            <div className="shadow-2xl rounded-md h-auto">
              <Suspense fallback={<CardSkeleton />}>
                <EngagementComp rawData={EngagementData} />
              </Suspense>
            </div>
          </div>
          <div className="flex flex-col gap-4 h-auto">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 h-auto">
              <Suspense fallback={<CardSkeleton />}>
                <AudienceComp AudienceData={AudienceData} />
              </Suspense>
              <Suspense fallback={<CardSkeleton />}>
                <ContentComp ContentData={ContentData} />
              </Suspense>
            </div>
            <div className="flex h-full min-h-48">
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
