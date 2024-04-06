import { Dashboard } from "@/components/dashboard";
import { Suspense } from "react";

export type SearchParams = {
  month: string | "all";
  audience?: string | null;
  contentType?: string | null;
  satisfaction?: string | null;
  location?: string | null;
  age?: string | null;
};

export const runtime = "edge";

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="flex w-full">
      <Suspense fallback={<DashSkeleton />}>
        <Dashboard
          month={searchParams.month || "all"}
          audience={searchParams.audience}
          contentType={searchParams.contentType}
          satisfaction={searchParams.satisfaction}
          location={searchParams.location}
          age={searchParams.age}
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
