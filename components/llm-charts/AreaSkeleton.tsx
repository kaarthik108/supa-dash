"use client";
import { Card } from "@tremor/react";
import React from "react";
import { BotMessage, SystemMessage } from "../message";
import { Skeleton } from "../ui/skeleton";

export default function AreaSkeleton() {
  return (
    <>
      <BotMessage>
        <Card className="w-full">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-80" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/5" />
            </div>
          </div>
        </Card>
      </BotMessage>
    </>
  );
}
