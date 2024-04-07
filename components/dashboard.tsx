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
  fetchAgeDistributionByLocation,
  fetchAudienceData,
  fetchContentData,
  fetchSubscribersByLocation,
} from "@/app/actions";
import {
  fetchBudgetData,
  fetchClicksData,
  fetchImpressionData,
  fetchRevenueData,
  fetchSubsData,
} from "@/app/actions/kpi";
import {
  BudgetCard,
  ClicksCard,
  ImpressionCard,
  RevenueCard,
  SubscriberCard,
} from "./kpi";

export async function Dashboard({
  month,
  audience,
  contentType,
  satisfaction,
  location,
  age,
}: SearchParams) {
  const [
    AudienceData,
    ContentData,
    subscribersByLocation,
    ageDistributionByLocation,
    RevenueData,
    BudgetData,
    ClicksData,
    ImpressionData,
    SubsData,
  ] = await Promise.all([
    fetchAudienceData(month, audience, contentType, satisfaction, location),
    fetchContentData(month, audience, contentType, satisfaction),
    fetchSubscribersByLocation(
      month,
      audience,
      contentType,
      satisfaction,
      null,
      age
    ),
    fetchAgeDistributionByLocation(
      month,
      audience,
      contentType,
      satisfaction,
      location
    ),
    fetchRevenueData(
      audience || null,
      contentType || null,
      satisfaction || null,
      location || null,
      age || null,
      month
    ),
    fetchBudgetData(
      audience || null,
      contentType || null,
      satisfaction || null,
      location || null,
      age || null,
      month
    ),
    fetchClicksData(
      audience || null,
      contentType || null,
      satisfaction || null,
      location || null,
      age || null,
      month
    ),
    fetchImpressionData(
      audience || null,
      contentType || null,
      satisfaction || null,
      location || null,
      age || null,
      month || null
    ),
    fetchSubsData(
      audience || null,
      contentType || null,
      satisfaction || null,
      location || null,
      age || null,
      month || null
    ),
  ]);

  return (
    <div className="flex h-full w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-8">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
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
        <div className="flex flex-col gap-8 sm:grid lg:grid-cols-2 sm:gap-8">
          <div className="flex flex-col gap-8">
            <div className="h-auto shadow-md">
              {/* <Suspense fallback={<CardSkeleton />}>
                <PlatformCard
                  {...{
                    month,
                    audience,
                    contentType,
                    satisfaction,
                    location,
                    age,
                  }}
                />
              </Suspense> */}
            </div>
            <div className="shadow-md rounded-md">
              <Suspense fallback={<CardSkeleton />}>
                <EngagementCard
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
            </div>
            <Suspense fallback={<CardSkeleton />}>
              <LocationCard
                subscribersByLocation={subscribersByLocation}
                ageDistributionByLocation={ageDistributionByLocation}
                location={location || null}
              />
            </Suspense>
          </div>
          <div className="flex flex-col gap-8">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Suspense fallback={<CardSkeleton />}>
                <AudienceCard AudienceData={AudienceData} />
              </Suspense>
              <Suspense fallback={<CardSkeleton />}>
                <ContentCard ContentData={ContentData} />
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
