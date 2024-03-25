import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function RecentSalesCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {/* Recent sales content */}
      </CardContent>
    </Card>
  );
}
