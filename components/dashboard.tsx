import { SearchParams } from "@/app/dashboard/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AudienceCard } from "./AudienceCard";
import { ContentCard } from "./ContentCard";
import { TopHeader } from "./Header";
import { PlatformCard } from "./PlatformCard";
import { BudgetCard } from "./kpi/BudgetCard";
import { ClicksCard } from "./kpi/ClicksCard";
import { ImpressionCard } from "./kpi/ImpressionCard";
import { RevenueCard } from "./kpi/RevenueCard";

export function Dashboard({ month, audience, contentType }: SearchParams) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <TopHeader month={month} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:col-span-1">
            <Card className="h-full">
              <CardContent className="h-full overflow-x-auto custom-scrollbar">
                <PlatformCard
                  month={month}
                  audience={audience}
                  contentType={contentType}
                />
              </CardContent>
            </Card>
            {/* <Card className="h-full">
              <CardContent className="h-full overflow-x-auto custom-scrollbar">
                <PlatformCard />
              </CardContent>
            </Card> */}
          </div>
          <Card className="md:col-span-1 h-full">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/02.png" alt="Avatar" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Jackson Lee
                  </p>
                  <p className="text-sm text-muted-foreground">
                    jackson.lee@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$39.00</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/03.png" alt="Avatar" />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Isabella Nguyen
                  </p>
                  <p className="text-sm text-muted-foreground">
                    isabella.nguyen@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$299.00</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/04.png" alt="Avatar" />
                  <AvatarFallback>WK</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    William Kim
                  </p>
                  <p className="text-sm text-muted-foreground">
                    will@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$99.00</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/05.png" alt="Avatar" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-sm text-muted-foreground">
                    sofia.davis@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$39.00</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:col-span-1">
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

            {/* <Card className="h-full">
              <CardContent className="h-full overflow-x-auto custom-scrollbar">
                <PlatformCard />
              </CardContent>
            </Card> */}
          </div>
        </div>
      </main>
    </div>
  );
}
