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
  platform?: string | null;
  campaignId?: string | null;
};

// export const runtime = "edge";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  const {
    month,
    audience,
    contentType,
    satisfaction,
    location,
    age,
    platform,
    campaignId,
  } = resolvedSearchParams;

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
    fetchAudienceData(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age,
      platform,
      campaignId
    ),
    fetchContentData(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age,
      platform,
      campaignId
    ),
    fetchSubscribersByLocation(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age,
      platform,
      campaignId
    ),
    fetchAgeDistributionByLocation(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age,
      platform,
      campaignId
    ),
    fetchRevenueData(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age,
      platform,
      campaignId
    ),
    fetchBudgetData(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age,
      platform,
      campaignId
    ),
    fetchClicksData(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age,
      platform,
      campaignId
    ),
    fetchImpressionData(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age,
      platform,
      campaignId
    ),
    fetchSubsData(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age,
      platform,
      campaignId
    ),
    fetchEngagementData(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age,
      platform,
      campaignId
    ),
    fetchPlatformData(
      month,
      audience,
      contentType,
      satisfaction,
      location,
      age,
      platform,
      campaignId
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
