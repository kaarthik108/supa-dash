import { Dashboard } from "@/components/dashboard";

export type SearchParams = {
  month: string | "all";
  audience?: string | null;
  contentType?: string | null;
};
export const runtime = "edge";

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="flex w-full">
      <Dashboard
        month={searchParams.month || "all"}
        audience={searchParams.audience}
        contentType={searchParams.contentType}
      />
    </div>
  );
}
