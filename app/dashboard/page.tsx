import { Dashboard } from "@/components/dashboard";

export type SearchParams = {
  month: string | "all";
  audience?: string | null;
  contentType?: string | null;
};

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Dashboard
        month={searchParams.month || "all"}
        audience={searchParams.audience}
        contentType={searchParams.contentType}
      />
    </main>
  );
}
