"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompactSlider } from "../../compact-slider";
import { commonSliders, warpShapeOptions, warpSliders } from "../../constants/shader-config";
import {
  renderSliders,
  ShaderColorDisplay,
  ShaderControlsBaseProps,
  ShaderControlsHeader,
} from "./shared";

export const WarpControls = ({
  settings,
  setSettings,
  aiColors,
  onExtract,
  onShuffle,
  isExtracting,
  isAutoExtracting,
  hasImage,
}: ShaderControlsBaseProps) => {
  return (
    <div className="space-y-6 text-center animate-in fade-in slide-in-from-top-2">
      <ShaderControlsHeader
        title="高级着色器控制"
        onShuffle={onShuffle}
        onExtract={onExtract}
        isExtracting={isExtracting}
        isAutoExtracting={isAutoExtracting}
        hasImage={hasImage}
        aiColorsCount={aiColors.length}
      />

      <div className="space-y-3">
        {renderSliders(
          [commonSliders.speed, commonSliders.distortion, commonSliders.swirl],
          settings,
          setSettings,
        )}

        <CompactSlider
          label="比例"
          valueDisplay={settings.shaderScale.toFixed(1)}
          value={[settings.shaderScale]}
          onValueChange={([v]) => setSettings((p) => ({ ...p, shaderScale: v }))}
          min={0.1}
          max={4}
          step={0.1}
        />

        {renderSliders(
          warpSliders.filter((s) => s.key !== "warpShapeScale"),
          settings,
          setSettings,
        )}

        {/* Shape selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <Label className="text-[10px] text-gray-400">形状</Label>
            <span className="text-[9px] uppercase tabular-nums text-gray-400">
              {settings.warpShape}
            </span>
          </div>
          <Select
            value={settings.warpShape}
            onValueChange={(value: "checks" | "stripes" | "edge") =>
              setSettings((p) => ({ ...p, warpShape: value }))
            }
          >
            <SelectTrigger className="h-8 w-full border-gray-100 bg-gray-50/50 text-[10px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {warpShapeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Shape scale slider */}
        <CompactSlider
          label="形状比例"
          valueDisplay={settings.warpShapeScale.toFixed(2)}
          value={[settings.warpShapeScale]}
          onValueChange={([v]) => setSettings((p) => ({ ...p, warpShapeScale: v }))}
          min={0}
          max={1}
          step={0.01}
        />
      </div>

      <ShaderColorDisplay aiColors={aiColors} />
    </div>
  );
};
