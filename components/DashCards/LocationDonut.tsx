import { DonutChartComponent } from "../charts/DonutChart";
import { Card, CardContent, CardHeader } from "../ui/card";

type LocationData = {
  name: string;
  value: number;
};

export async function LocationCard({
  subscribersByLocation,
  ageDistributionByLocation,
  location,
}: {
  subscribersByLocation: Record<string, number>;
  ageDistributionByLocation: Record<string, number>;
  location: string | null;
}) {
  const subscribersData: LocationData[] = Object.entries(subscribersByLocation)
    .filter(([_, count]) => !isNaN(count))
    .map(([locationName, count]) => ({
      name: locationName,
      value: count,
    }));

  const ageDistributionData: LocationData[] = Object.entries(
    ageDistributionByLocation
  )
    .filter(([_, count]) => !isNaN(count))
    .map(([ageGroup, count]) => ({
      name: ageGroup,
      value: count,
    }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card
        className="h-full shadow-md animate-fade-up w-full"
        style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
      >
        <CardHeader className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
          Subscribers by Location
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <DonutChartComponent
            data={subscribersData}
            variant="donut"
            filterType="location"
            selectedFilter={location}
          />
        </CardContent>
      </Card>
      <Card
        className="h-full shadow-md animate-fade-up w-full"
        style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
      >
        <CardHeader className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
          Age Distribution
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <DonutChartComponent
            data={ageDistributionData}
            variant="pie"
            filterType="age"
          />
        </CardContent>
      </Card>
    </div>
  );
}
