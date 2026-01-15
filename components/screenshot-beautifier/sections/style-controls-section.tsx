"use client";

import { Label } from "@/components/ui/label";
import { CompactSlider } from "../compact-slider";
import { ImageSettings } from "../types";

interface StyleControlsSectionProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
}

export const StyleControlsSection = ({ settings, setSettings }: StyleControlsSectionProps) => {
  return (
    <section className="space-y-6 border-t border-gray-50 pt-6">
      <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        截图样式
      </Label>

      <div className="space-y-3">
        <CompactSlider
          label="圆角"
          valueDisplay={`${settings.borderRadius}px`}
          value={[settings.borderRadius]}
          onValueChange={([value]) => setSettings((prev) => ({ ...prev, borderRadius: value }))}
          max={100}
          step={1}
        />

        <CompactSlider
          label="内边距"
          valueDisplay={`${settings.padding}px`}
          value={[settings.padding]}
          onValueChange={([value]) => setSettings((prev) => ({ ...prev, padding: value }))}
          max={400}
          step={10}
        />

        <CompactSlider
          label="缩放"
          valueDisplay={`${Math.round(settings.scale * 100)}%`}
          value={[settings.scale]}
          onValueChange={([value]) => setSettings((prev) => ({ ...prev, scale: value }))}
          min={0.1}
          max={3}
          step={0.1}
        />

        <CompactSlider
          label="阴影"
          valueDisplay={`${settings.shadow}px`}
          value={[settings.shadow]}
          onValueChange={([value]) => setSettings((prev) => ({ ...prev, shadow: value }))}
          max={50}
          step={1}
        />
      </div>
    </section>
  );
};
