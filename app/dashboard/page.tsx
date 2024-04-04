import { Dashboard } from "@/components/dashboard";
import { Suspense } from "react";

export type SearchParams = {
  month: string | "all";
  audience?: string | null;
  contentType?: string | null;
  satisfaction?: string | null;
  location?: string | null;
};

export const runtime = "edge";

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="flex w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard
          month={searchParams.month || "all"}
          audience={searchParams.audience}
          contentType={searchParams.contentType}
          satisfaction={searchParams.satisfaction}
          location={searchParams.location}
        />
      </Suspense>
    </div>
  );
}
