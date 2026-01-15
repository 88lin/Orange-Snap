"use client";

import { commonSliders } from "../../constants/shader-config";
import {
  renderSliders,
  ShaderColorDisplay,
  ShaderControlsBaseProps,
  ShaderControlsHeader,
} from "./shared";

export const PaperMeshControls = ({
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
          [
            commonSliders.speed,
            commonSliders.distortion,
            commonSliders.swirl,
            commonSliders.grainMixer,
            commonSliders.grainOverlay,
          ],
          settings,
          setSettings,
        )}
      </div>

      <ShaderColorDisplay aiColors={aiColors} />
    </div>
  );
};
