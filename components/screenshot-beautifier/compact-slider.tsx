"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface CompactSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label: string
  valueDisplay?: string | number
}

const CompactSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  CompactSliderProps
>(({ className, label, valueDisplay, ...props }, ref) => (
  <div className={cn(
    "relative flex items-center w-full h-11 px-4 bg-gray-100/50 rounded-2xl group transition-all hover:bg-gray-100/80",
    className
  )}>
    <span className="text-[11px] font-medium text-gray-400 select-none pointer-events-none min-w-[48px]">
      {label}
    </span>

    <SliderPrimitive.Root
      ref={ref}
      className="relative flex items-center flex-1 h-full mx-2 touch-none select-none"
      {...props}
    >
      <SliderPrimitive.Track className="relative h-full w-full grow bg-transparent">
        <SliderPrimitive.Range className="absolute h-full bg-transparent" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block w-1.5 h-6 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 cursor-grab active:cursor-grabbing hover:scale-y-110 active:scale-y-90" />
    </SliderPrimitive.Root>

    <span className="text-[11px] font-medium text-gray-400 tabular-nums select-none pointer-events-none text-right min-w-[32px]">
      {valueDisplay ?? props.value?.[0]}
    </span>
  </div>
))
CompactSlider.displayName = "CompactSlider"

export { CompactSlider }
