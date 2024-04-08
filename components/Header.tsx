import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CampaignFilter } from "./CampaignFilter";
import { ClearParams } from "./ClearParams";
import { PlatformFilter } from "./PlatformFilter";
import { MonthFilter } from "./ui/combobox";

export function TopHeader() {
  return (
    <header className="sticky top-0 flex items-center gap-4 border-b bg-background px-4 py-2 md:px-6 md:py-4 flex-wrap">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image
            className="h-6 w-6"
            src="/line-chart.png"
            alt="Hack Dash Logo"
            width={24}
            height={24}
          />
          <span className="sr-only">Hack Dash</span>
        </Link>
        <Link
          href="/about"
          className="text-muted-foreground transition-colors hover:text-foreground text-sm"
          prefetch
        >
          About
        </Link>
      </div>
      <div className="flex gap-3 flex-wrap justify-center md:justify-end flex-1">
        <Suspense fallback>
          <ClearParams />
        </Suspense>
        <Suspense fallback>
          <PlatformFilter />
        </Suspense>
        <Suspense fallback>
          <CampaignFilter />
        </Suspense>
        <Suspense fallback>
          <MonthFilter />
        </Suspense>
      </div>
    </header>
  );
}
