import { Package2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ClearParams } from "./ClearParams";
import { MonthFilter } from "./ui/combobox";

export function TopHeader() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6  justify-between">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">Hack Dash</span>
        </Link>
        <Link
          href="/about"
          className="text-muted-foreground transition-colors hover:text-foreground"
          prefetch
        >
          About
        </Link>
      </nav>
      <div className="flex gap-3">
        <Suspense fallback={<div>Loading...</div>}>
          <ClearParams />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <MonthFilter />
        </Suspense>
      </div>
    </header>
  );
}
