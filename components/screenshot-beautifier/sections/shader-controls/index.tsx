"use client";

import { ImageSettings } from "../../types";
import { DotOrbitControls } from "./dot-orbit-controls";
import { GrainGradientControls } from "./grain-gradient-controls";
import { MeshControls } from "./mesh-controls";
import { NoiseControls } from "./noise-controls";
import { PaperMeshControls } from "./paper-mesh-controls";
import { SmokeRingControls } from "./smoke-ring-controls";
import { StaticMeshControls } from "./static-mesh-controls";
import { VoronoiControls } from "./voronoi-controls";
import { WarpControls } from "./warp-controls";

export interface ShaderControlsProps {
  backgroundType: ImageSettings["backgroundType"];
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
  aiColors: string[];
  onExtract: () => void;
  onShuffle: () => void;
  isExtracting: boolean;
  isAutoExtracting: boolean;
  hasImage: boolean;
}

export const ShaderControls = ({
  backgroundType,
  settings,
  setSettings,
  aiColors,
  onExtract,
  onShuffle,
  isExtracting,
  isAutoExtracting,
  hasImage,
}: ShaderControlsProps) => {
  const commonProps = {
    settings,
    setSettings,
    aiColors,
    onExtract,
    onShuffle,
    isExtracting,
    isAutoExtracting,
    hasImage,
  };

  switch (backgroundType) {
    case "mesh":
      return <MeshControls {...commonProps} />;
    case "paper-mesh":
      return <PaperMeshControls {...commonProps} />;
    case "static-mesh":
      return <StaticMeshControls {...commonProps} />;
    case "dot-orbit":
      return <DotOrbitControls {...commonProps} />;
    case "noise":
      return <NoiseControls {...commonProps} />;
    case "voronoi":
      return <VoronoiControls {...commonProps} />;
    case "grain-gradient":
      return <GrainGradientControls {...commonProps} />;
    case "warp":
      return <WarpControls {...commonProps} />;
    case "smoke-ring":
      return <SmokeRingControls {...commonProps} />;
    default:
      return null;
  }
};

// Re-export for convenience
export * from "./shared";
