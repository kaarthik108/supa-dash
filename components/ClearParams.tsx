"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

export function ClearParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasSearchParams = searchParams.toString() !== "";

  if (!hasSearchParams) {
    return null;
  }

  return (
    <div>
      <Button
        type="submit"
        variant={"outline"}
        onClick={() => {
          router.replace("/dashboard", { scroll: false });
        }}
      >
        Clear filters
      </Button>
    </div>
  );
}
