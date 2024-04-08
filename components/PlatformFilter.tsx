"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useCallback } from "react";
import { SocialIcon } from "react-social-icons";

const platforms = ["Instagram", "TikTok", "YouTube", "Facebook", "Blogs"];

export function PlatformFilter() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlatform = searchParams.get("platform") || null;
  const pathname = usePathname();

  const handlePlatformChange = useCallback(
    (value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("platform", value);
      } else {
        params.delete("platform");
      }
      router.push(`/dashboard?${params.toString()}`, { scroll: false });
      router.refresh();
      setOpen(false);
    },
    [router, searchParams]
  );
  if (!pathname?.startsWith("/dashboard")) {
    return null;
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedPlatform || "Select Platform"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Filter by Platform"
            className="h-9 focus:outline-none focus:ring-0 border-none"
          />
          <CommandEmpty>No Platform found.</CommandEmpty>
          <CommandGroup>
            {platforms.map((platform) => (
              <CommandItem
                key={platform}
                value={platform}
                onSelect={() => handlePlatformChange(platform)}
                className="cursor-pointer flex items-center"
              >
                {renderPlatformIcon(platform)}
                <span className="ml-2">{platform}</span>
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedPlatform === platform ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const renderPlatformIcon = (platform: string) => {
  switch (platform) {
    case "Instagram":
      return (
        <SocialIcon network="instagram" style={{ height: 18, width: 18 }} />
      );
    case "TikTok":
      return <SocialIcon network="tiktok" style={{ height: 18, width: 18 }} />;
    case "YouTube":
      return <SocialIcon network="youtube" style={{ height: 18, width: 18 }} />;
    case "Facebook":
      return (
        <SocialIcon network="facebook" style={{ height: 18, width: 18 }} />
      );
    case "Blogs":
      return <SocialIcon network="rss" style={{ height: 18, width: 18 }} />;
    default:
      return null;
  }
};
