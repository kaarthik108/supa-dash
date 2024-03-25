import { Dashboard } from "@/components/dashboard";

export default function Home({
  searchParams,
}: {
  searchParams: { month: string | undefined; include: string | undefined };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Dashboard month={searchParams.month || "all"} />
    </main>
  );
}
