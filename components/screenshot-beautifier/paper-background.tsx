"use client";

import { MeshGradient, DotOrbit } from "@paper-design/shaders-react";
import { ImageSettings } from "./types";
import { useMemo } from "react";

interface PaperBackgroundProps {
  settings: ImageSettings;
  aiColors: string[];
}

export const PaperBackground = ({ settings, aiColors }: PaperBackgroundProps) => {
  const colors = useMemo(() => {
    if (aiColors.length >= 4) return aiColors.slice(0, 4);
    if (aiColors.length > 0) {
      // Pad with existing colors if we have some but less than 4
      const padded = [...aiColors];
      while (padded.length < 4) {
        padded.push(aiColors[padded.length % aiColors.length]);
      }
      return padded;
    }
    // Default fallback colors
    return ["#5100ff", "#00ff80", "#ffcc00", "#ea00ff"];
  }, [aiColors]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {settings.backgroundType === "paper-mesh" && (
        <MeshGradient
          colors={colors}
          distortion={settings.shaderDistortion}
          swirl={settings.shaderSwirl}
          speed={settings.shaderSpeed}
          style={{ width: "100%", height: "100%" }}
        />
      )}
      {settings.backgroundType === "dot-orbit" && (
        <DotOrbit
          colors={colors}
          colorBack={settings.shaderColorBack}
          scale={settings.shaderScale}
          speed={settings.shaderSpeed}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};
