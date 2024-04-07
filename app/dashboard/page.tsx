import { Dashboard } from "@/components/dashboard";
import { Suspense } from "react";
import {
  fetchAgeDistributionByLocation,
  fetchAudienceData,
  fetchContentData,
  fetchEngagementData,
  fetchPlatformData,
  fetchSubscribersByLocation,
} from "../actions";
import {
  fetchBudgetData,
  fetchClicksData,
  fetchImpressionData,
  fetchRevenueData,
  fetchSubsData,
} from "../actions/kpi";

export type SearchParams = {
  month?: string | "all";
  audience?: string | null;
  contentType?: string | null;
  satisfaction?: string | null;
  location?: string | null;
  age?: string | null;
};

// export const runtime = "edge";

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { month, audience, contentType, satisfaction, location, age } =
    searchParams;

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
    EngagementData,
    PlatformData,
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
      month
    ),
    fetchSubsData(
      audience || null,
      contentType || null,
      satisfaction || null,
      location || null,
      age || null,
      month
    ),
    fetchEngagementData(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age
    ),
    fetchPlatformData(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age
    ),
  ]);

  return (
    <div className="flex w-full">
      <Suspense fallback={<DashSkeleton />}>
        <Dashboard
          RevenueData={RevenueData}
          BudgetData={BudgetData}
          ImpressionData={ImpressionData}
          ClicksData={ClicksData}
          SubsData={SubsData}
          AudienceData={AudienceData}
          ContentData={ContentData}
          subscribersByLocation={subscribersByLocation}
          ageDistributionByLocation={ageDistributionByLocation}
          EngagementData={EngagementData}
          location={location}
          PlatformData={PlatformData}
        />
      </Suspense>
    </div>
  );
}

async function DashSkeleton() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col h-full w-full items-center justify-center">
        Hold on...
      </div>
    </div>
  );
}
