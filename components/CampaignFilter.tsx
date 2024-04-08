"use client";
import { fetchCampaignIds } from "@/app/actions";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";

export function CampaignFilter() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCampaignId = searchParams.get("campaignId") || null;
  const [campaignIds, setCampaignIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = (await fetchCampaignIds()) as { CampaignID: string }[];
      const ids = result.map((item: { CampaignID: string }) => item.CampaignID);
      setCampaignIds(ids);
    };
    fetchData();
  }, []);

  const handleCampaignChange = useCallback(
    (value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("campaignId", value);
      } else {
        params.delete("campaignId");
      }
      router.push(`/dashboard?${params.toString()}`, { scroll: false });
      router.refresh();
      setOpen(false);
    },
    [router, searchParams]
  );

  const filteredCampaignIds = campaignIds.filter((campaignId) =>
    campaignId.toLowerCase().includes(searchQuery.toLowerCase())
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
          {selectedCampaignId || "Select Campaign"}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search campaigns..."
            className="h-9 focus:outline-none focus:ring-0 border-none"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No campaigns found.</CommandEmpty>
          <ScrollArea className="h-72">
            <CommandGroup>
              {filteredCampaignIds.map((campaignId) => (
                <CommandItem
                  key={campaignId}
                  value={campaignId}
                  onSelect={() => handleCampaignChange(campaignId)}
                  className="cursor-pointer flex items-center"
                >
                  <span className="ml-2">{campaignId}</span>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedCampaignId === campaignId
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
