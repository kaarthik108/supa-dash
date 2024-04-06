import dynamic from "next/dynamic";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function CardSkeleton() {
  return (
    <Card className="h-40">
      <Skeleton className="h-full w-full" />
    </Card>
  );
}

const RevenueComp = dynamic(
  () => import("./RevenueCard").then((mod) => mod.RevenueCard),
  {
    ssr: false,
    loading: () => <CardSkeleton />,
  }
);

const BudgetComp = dynamic(
  () => import("./BudgetCard").then((mod) => mod.BudgetCard),
  {
    ssr: false,
    loading: () => <CardSkeleton />,
  }
);

const ClicksComp = dynamic(
  () => import("./ClicksCard").then((mod) => mod.ClicksCard),
  {
    ssr: false,
    loading: () => <CardSkeleton />,
  }
);

const ImpressionComp = dynamic(
  () => import("./ImpressionCard").then((mod) => mod.ImpressionCard),
  {
    ssr: false,
    loading: () => <CardSkeleton />,
  }
);

const SubscriberComp = dynamic(
  () => import("./SubscriberCard").then((mod) => mod.SubscriberCard),
  {
    ssr: false,
    loading: () => <CardSkeleton />,
  }
);

export { BudgetComp, ClicksComp, ImpressionComp, RevenueComp, SubscriberComp };
