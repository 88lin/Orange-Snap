"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shuffle, Sparkles } from "lucide-react";
import { CompactSlider } from "../../compact-slider";
import { SliderConfig } from "../../constants/shader-config";
import { ImageSettings, solidColorPresets } from "../../types";

export interface ShaderControlsBaseProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
  aiColors: string[];
  onExtract: () => void;
  onShuffle: () => void;
  isExtracting: boolean;
  isAutoExtracting: boolean;
  hasImage: boolean;
}

// Shared header component for all shader controls
export const ShaderControlsHeader = ({
  title,
  onShuffle,
  onExtract,
  isExtracting,
  isAutoExtracting,
  hasImage,
  aiColorsCount,
}: {
  title: string;
  onShuffle: () => void;
  onExtract: () => void;
  isExtracting: boolean;
  isAutoExtracting: boolean;
  hasImage: boolean;
  aiColorsCount: number;
}) => (
  <div className="flex items-center justify-between px-1">
    <Label className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
      {title}
    </Label>
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onShuffle}
        disabled={aiColorsCount < 2 || isExtracting || isAutoExtracting}
        className="h-6 gap-1 px-1.5 text-[9px] text-gray-500 hover:bg-gray-100"
        title="改变颜色顺序"
      >
        <Shuffle className="h-3 w-3" />
        改变顺序
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onExtract}
        disabled={isExtracting || isAutoExtracting || !hasImage}
        className="h-6 gap-1 px-1.5 text-[9px] text-orange-500 hover:bg-orange-50"
      >
        {isExtracting || isAutoExtracting ? (
          <Loader2 className="h-2.5 w-2.5 animate-spin" />
        ) : (
          <Sparkles className="h-3 w-3" />
        )}
        同步 AI 色彩
      </Button>
    </div>
  </div>
);

// Shared color display component
export const ShaderColorDisplay = ({ aiColors }: { aiColors: string[] }) => (
  <div className="space-y-3">
    <p className="px-1 text-center text-[9px] text-gray-400">色彩配置 (AI 同步或预设)</p>
    <div className="flex flex-wrap justify-center gap-2 px-1">
      {(aiColors.length > 0 ? aiColors : solidColorPresets.slice(0, 8).map((p) => p.color)).map(
        (color, i) => (
          <div
            key={i}
            className="h-5 w-5 rounded-full border border-gray-100 shadow-sm"
            style={{ backgroundColor: color }}
          />
        ),
      )}
    </div>
    <p className="px-1 text-center text-[9px] italic leading-relaxed text-gray-600/60">
      使用上方"同步 AI 色彩"将截图氛围注入着色器
    </p>
  </div>
);

// Helper to render sliders from config
export const renderSliders = (
  sliders: SliderConfig[],
  settings: ImageSettings,
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>,
) =>
  sliders.map((slider) => (
    <CompactSlider
      key={slider.key}
      label={slider.label}
      valueDisplay={
        slider.format ? slider.format(settings[slider.key] as number) : String(settings[slider.key])
      }
      value={[settings[slider.key] as number]}
      onValueChange={([v]) => setSettings((p) => ({ ...p, [slider.key]: v }))}
      min={slider.min}
      max={slider.max}
      step={slider.step}
    />
  ));

// Shared background color picker component
export const BackgroundColorPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) => (
  <div className="space-y-2 pt-2">
    <Label className="text-[10px] text-gray-400">底色 (Background)</Label>
    <div className="flex items-center gap-2">
      <Input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 border-none bg-transparent p-0"
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 flex-1 border-gray-100 bg-gray-50/50 text-[10px]"
      />
    </div>
  </div>
);

// Dual color picker for voronoi-style controls
export const DualColorPicker = ({
  label1,
  value1,
  onChange1,
  label2,
  value2,
  onChange2,
}: {
  label1: string;
  value1: string;
  onChange1: (color: string) => void;
  label2: string;
  value2: string;
  onChange2: (color: string) => void;
}) => (
  <div className="grid grid-cols-2 gap-3 pt-2">
    <div className="space-y-2">
      <Label className="text-[10px] text-gray-400">{label1}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={value1}
          onChange={(e) => onChange1(e.target.value)}
          className="h-6 w-6 border-none bg-transparent p-0"
        />
        <Input
          type="text"
          value={value1}
          onChange={(e) => onChange1(e.target.value)}
          className="h-7 flex-1 border-gray-100 bg-gray-50/50 text-[9px]"
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label className="text-[10px] text-gray-400">{label2}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={value2}
          onChange={(e) => onChange2(e.target.value)}
          className="h-6 w-6 border-none bg-transparent p-0"
        />
        <Input
          type="text"
          value={value2}
          onChange={(e) => onChange2(e.target.value)}
          className="h-7 flex-1 border-gray-100 bg-gray-50/50 text-[9px]"
        />
      </div>
    </div>
  </div>
);
