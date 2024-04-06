import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { BudgetCard } from "./BudgetCard";
import { ClicksCard } from "./ClicksCard";
import { ImpressionCard } from "./ImpressionCard";
import { RevenueCard } from "./RevenueCard";
import { SubscriberCard } from "./SubscriberCard";

function CardSkeleton() {
  return (
    <Card className="h-40">
      <Skeleton className="h-full w-full" />
    </Card>
  );
}

export { BudgetCard, ClicksCard, ImpressionCard, RevenueCard, SubscriberCard };
