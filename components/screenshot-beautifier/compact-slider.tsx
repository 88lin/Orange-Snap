"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface CompactSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label: string;
  valueDisplay?: string | number;
}

const CompactSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  CompactSliderProps
>(({ className, label, valueDisplay, ...props }, ref) => (
  <div
    className={cn(
      "group relative flex h-11 w-full items-center rounded-2xl bg-gray-100/50 px-4 transition-all hover:bg-gray-100/80",
      className,
    )}
  >
    <span className="pointer-events-none min-w-[48px] select-none text-[11px] font-medium text-gray-400">
      {label}
    </span>

    <SliderPrimitive.Root
      ref={ref}
      className="relative mx-2 flex h-full flex-1 touch-none select-none items-center"
      {...props}
    >
      <SliderPrimitive.Track className="relative h-full w-full grow bg-transparent">
        <SliderPrimitive.Range className="absolute h-full bg-transparent" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-6 w-1.5 cursor-grab rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] transition-transform hover:scale-y-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 active:scale-y-90 active:cursor-grabbing" />
    </SliderPrimitive.Root>

    <span className="pointer-events-none min-w-[32px] select-none text-right text-[11px] font-medium tabular-nums text-gray-400">
      {valueDisplay ?? props.value?.[0]}
    </span>
  </div>
));
CompactSlider.displayName = "CompactSlider";

export { CompactSlider };
