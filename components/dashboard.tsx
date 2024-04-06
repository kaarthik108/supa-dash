import { SearchParams } from "@/app/dashboard/page";
import { Suspense } from "react";
import { Chat } from "./Chat";
import {
  AudienceComp,
  ContentComp,
  EngagementComp,
  LocationComp,
  PlatformComp,
} from "./DashCards";
import {
  BudgetComp,
  ClicksComp,
  ImpressionComp,
  RevenueComp,
  SubscriberComp,
} from "./kpi";

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
          <Suspense fallback>
            <RevenueComp {...{ month, audience, contentType, satisfaction }} />
          </Suspense>
          <Suspense fallback>
            <BudgetComp {...{ month, audience, contentType, satisfaction }} />
          </Suspense>
          <Suspense fallback>
            <ImpressionComp
              {...{ month, audience, contentType, satisfaction }}
            />
          </Suspense>
          <Suspense fallback>
            <ClicksComp {...{ month, audience, contentType, satisfaction }} />
          </Suspense>
          <Suspense fallback>
            <SubscriberComp
              {...{ month, audience, contentType, satisfaction }}
            />
          </Suspense>
        </div>
        <div className="flex flex-col gap-8 sm:grid lg:grid-cols-2 sm:gap-8">
          <div className="flex flex-col gap-8">
            <div className="h-auto shadow-md">
              <Suspense fallback>
                <PlatformComp
                  {...{ month, audience, contentType, satisfaction }}
                />
              </Suspense>
            </div>
            <div className="shadow-md rounded-md">
              <Suspense fallback>
                <EngagementComp
                  {...{ month, audience, contentType, satisfaction }}
                />
              </Suspense>
            </div>
            <Suspense fallback>
              <LocationComp
                {...{ month, audience, contentType, satisfaction, location }}
              />
            </Suspense>
          </div>
          <div className="flex flex-col gap-8">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Suspense fallback>
                <AudienceComp
                  {...{ month, audience, contentType, satisfaction }}
                />
              </Suspense>
              <Suspense fallback>
                <ContentComp
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
