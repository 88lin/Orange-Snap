"use client";

import { CompactSlider } from "../../compact-slider";
import { commonSliders, staticMeshSliders } from "../../constants/shader-config";
import {
  renderSliders,
  ShaderColorDisplay,
  ShaderControlsBaseProps,
  ShaderControlsHeader,
} from "./shared";

export const StaticMeshControls = ({
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
        {/* Static mesh has no speed control */}
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
          [commonSliders.grainMixer, commonSliders.grainOverlay],
          settings,
          setSettings,
        )}

        {renderSliders(staticMeshSliders, settings, setSettings)}
      </div>

      <ShaderColorDisplay aiColors={aiColors} />
    </div>
  );
};
