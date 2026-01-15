"use client";

import { CompactSlider } from "../../compact-slider";
import { commonSliders, voronoiSliders } from "../../constants/shader-config";
import {
  DualColorPicker,
  renderSliders,
  ShaderColorDisplay,
  ShaderControlsBaseProps,
  ShaderControlsHeader,
} from "./shared";

export const VoronoiControls = ({
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
        {renderSliders([commonSliders.speed], settings, setSettings)}

        <CompactSlider
          label="比例"
          valueDisplay={settings.shaderScale.toFixed(1)}
          value={[settings.shaderScale]}
          onValueChange={([v]) => setSettings((p) => ({ ...p, shaderScale: v }))}
          min={0.1}
          max={4}
          step={0.1}
        />

        {renderSliders(voronoiSliders, settings, setSettings)}

        <DualColorPicker
          label1="发光色"
          value1={settings.voronoiGlowColor}
          onChange1={(color) => setSettings((p) => ({ ...p, voronoiGlowColor: color }))}
          label2="间隙色"
          value2={settings.voronoiGapColor}
          onChange2={(color) => setSettings((p) => ({ ...p, voronoiGapColor: color }))}
        />
      </div>

      <ShaderColorDisplay aiColors={aiColors} />
    </div>
  );
};
