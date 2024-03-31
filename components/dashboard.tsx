import { SearchParams } from "@/app/dashboard/page";
import { Card, CardContent } from "@/components/ui/card";
import { AudienceCard } from "./AudienceCard";
import Chat from "./Chat";
import { ContentCard } from "./ContentCard";
import { PlatformCard } from "./PlatformCard";
import { MyResponsiveChoropleth } from "./charts/MapChart";
import { BudgetCard } from "./kpi/BudgetCard";
import { ClicksCard } from "./kpi/ClicksCard";
import { ImpressionCard } from "./kpi/ImpressionCard";
import { RevenueCard } from "./kpi/RevenueCard";

export function Dashboard({ month, audience, contentType }: SearchParams) {
  return (
    <div className="flex h-full w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {/* // kpi cards */}
          <RevenueCard
            month={month}
            audience={audience}
            contentType={contentType}
          />
          <BudgetCard
            month={month}
            audience={audience}
            contentType={contentType}
          />
          <ImpressionCard
            month={month}
            audience={audience}
            contentType={contentType}
          />
          <ClicksCard
            month={month}
            audience={audience}
            contentType={contentType}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
          <div className="grid grid-cols-1 gap-8">
            <Card
              className="h-72 animate-fade-up shadow-md"
              style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
            >
              <CardContent className="h-full overflow-x-auto custom-scrollbar pl-0">
                <PlatformCard
                  month={month}
                  audience={audience}
                  contentType={contentType}
                />
              </CardContent>
            </Card>
            <Card className="h-full w-full shadow-md">
              <MyResponsiveChoropleth />
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AudienceCard
                month={month}
                audience={audience}
                contentType={contentType}
              />
              <ContentCard
                month={month}
                audience={audience}
                contentType={contentType}
              />
            </div>
            <Chat />
          </div>
        </div>
      </main>
    </div>
  );
}
