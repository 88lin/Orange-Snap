"use client";

import { MeshGradient, DotOrbit, SimplexNoise, Voronoi, GrainGradient, Warp, StaticMeshGradient, SmokeRing } from "@paper-design/shaders-react";
import { ImageSettings } from "./types";
import { useMemo } from "react";

interface PaperBackgroundProps {
  settings: ImageSettings;
  aiColors: string[];
}

export const PaperBackground = ({ settings, aiColors }: PaperBackgroundProps) => {
  const colors = useMemo(() => {
    const targetCount = (settings.backgroundType === "noise" || settings.backgroundType === "voronoi" || settings.backgroundType === "grain-gradient") ? 5 : 4;
    if (aiColors.length >= targetCount) return aiColors.slice(0, targetCount);
    if (aiColors.length > 0) {
      // Pad with existing colors if we have some but less than target
      const padded = [...aiColors];
      while (padded.length < targetCount) {
        padded.push(aiColors[padded.length % aiColors.length]);
      }
      return padded;
    }
    // Default fallback colors
    const defaults = ["#5100ff", "#00ff80", "#ffcc00", "#ea00ff", "#ffffff"];
    return defaults.slice(0, targetCount);
  }, [aiColors, settings.backgroundType]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {settings.backgroundType === "paper-mesh" && (
        <MeshGradient
          colors={colors}
          distortion={settings.shaderDistortion}
          swirl={settings.shaderSwirl}
          grainMixer={settings.grainMixer}
          grainOverlay={settings.grainOverlay}
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
      {settings.backgroundType === "noise" && (
        <SimplexNoise
          colors={colors}
          stepsPerColor={settings.noiseSteps}
          softness={settings.noiseSoftness}
          speed={settings.shaderSpeed}
          scale={settings.shaderScale}
          style={{ width: "100%", height: "100%" }}
        />
      )}
      {settings.backgroundType === "voronoi" && (
        <Voronoi
          colors={colors}
          colorGlow={settings.voronoiGlowColor}
          colorGap={settings.voronoiGapColor}
          stepsPerColor={settings.voronoiSteps}
          distortion={settings.voronoiDistortion}
          gap={settings.voronoiGap}
          glow={settings.voronoiGlow}
          speed={settings.shaderSpeed}
          scale={settings.shaderScale}
          style={{ width: "100%", height: "100%" }}
        />
      )}
      {settings.backgroundType === "grain-gradient" && (
        <GrainGradient
          colors={colors}
          colorBack={settings.shaderColorBack}
          softness={settings.grainSoftness}
          intensity={settings.grainIntensity}
          noise={settings.grainNoise}
          shape={settings.grainShape}
          speed={settings.shaderSpeed}
          scale={settings.shaderScale}
          style={{ width: "100%", height: "100%" }}
        />
      )}
      {settings.backgroundType === "warp" && (
        <Warp
          colors={colors}
          proportion={settings.warpProportion}
          softness={settings.warpSoftness}
          distortion={settings.shaderDistortion}
          swirl={settings.shaderSwirl}
          swirlIterations={settings.warpSwirlIterations}
          shape={settings.warpShape}
          shapeScale={settings.warpShapeScale}
          speed={settings.shaderSpeed}
          scale={settings.shaderScale}
          style={{ width: "100%", height: "100%" }}
        />
      )}
      {settings.backgroundType === "static-mesh" && (
        <StaticMeshGradient
          colors={colors}
          positions={settings.meshPositions}
          waveX={settings.meshWaveX}
          waveXShift={settings.meshWaveXShift}
          waveY={settings.meshWaveY}
          waveYShift={settings.meshWaveYShift}
          mixing={settings.meshMixing}
          grainMixer={settings.grainMixer}
          grainOverlay={settings.grainOverlay}
          rotation={settings.meshRotation}
          scale={settings.shaderScale}
          style={{ width: "100%", height: "100%" }}
        />
      )}
      {settings.backgroundType === "smoke-ring" && (
        <SmokeRing
          colors={colors}
          colorBack={settings.shaderColorBack}
          noiseScale={settings.smokeNoiseScale}
          noiseIterations={settings.smokeNoiseIterations}
          radius={settings.smokeRadius}
          thickness={settings.smokeThickness}
          innerShape={settings.smokeInnerShape}
          speed={settings.shaderSpeed}
          scale={settings.shaderScale}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};
