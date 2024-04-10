import { PlatformTable } from "../charts/TableChart";
import { Card, CardContent } from "../ui/card";

export async function PlatformCard({ rawData }: { rawData: any }) {
  return (
    <Card
      className=" overflow-x-auto custom-scrollbar pt-2 animate-fade-right h-[317px]"
      style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
    >
      <CardContent className="overflow-x-auto custom-scrollbar pl-0 pb-2">
        <PlatformTable data={rawData} />
      </CardContent>
    </Card>
  );
}
