"use client";
import { BarList, BarListProps } from "@tremor/react";
import { forwardRef } from "react";

type ClickableBarListProps = BarListProps & {
  onBarClick?: (payload: any) => void;
};

export const ClickableBarList = forwardRef<
  HTMLDivElement,
  ClickableBarListProps
>(({ onBarClick, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="relative"
      onClick={(event) => {
        if (onBarClick && event.target instanceof HTMLDivElement) {
          const bars = event.currentTarget.querySelectorAll(
            ".tremor-BarList-bar"
          );
          const clickedBar = Array.from(bars).find((bar) =>
            bar.contains(event.target as Node)
          );

          if (clickedBar) {
            const itemIndex = Array.from(bars).indexOf(clickedBar);
            const item = props.data[itemIndex];
            onBarClick(item);
          }
        }
      }}
    >
      <BarList {...props} className="tremor-BarList-clickable" />
      <style jsx>{`
        :global(.tremor-BarList-clickable .tremor-BarList-bar) {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
});

ClickableBarList.displayName = "ClickableBarList";
