import { PlatformTable } from "../charts/TableChart";
import { Card, CardContent } from "../ui/card";

export async function PlatformCard({ rawData }: { rawData: any }) {
  return (
    <Card
      className=" overflow-x-auto custom-scrollbar pt-2 animate-fade-right"
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <CardContent className="h-full overflow-x-auto custom-scrollbar pl-0">
        <PlatformTable data={rawData} />
      </CardContent>
    </Card>
  );
}
