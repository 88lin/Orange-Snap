"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useColorExtraction } from "./hooks/use-color-extraction";
import { BackgroundSelector } from "./sections/background-selector";
import { BrowserStyleSection } from "./sections/browser-style-section";
import { GradientSection } from "./sections/gradient-section";
import { PatternSection } from "./sections/pattern-section";
import { ShaderControls } from "./sections/shader-controls";
import { SolidColorSection } from "./sections/solid-color-section";
import { StyleControlsSection } from "./sections/style-controls-section";
import { WallpaperSection } from "./sections/wallpaper-section";
import { ImageSettings } from "./types";

interface SettingsPanelProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
  setWallpaperImage?: unknown; // Marked as optional/legacy
  defaultSettings: ImageSettings;
  image: HTMLImageElement | null;
  aiColors: string[];
  setAiColors: (colors: string[]) => void;
  aiGradients: Array<{ start: string; end: string }>;
  setAiGradients: (gradients: Array<{ start: string; end: string }>) => void;
  isAutoExtracting: boolean;
}

// Background types that use shader controls
const shaderBackgroundTypes = [
  "mesh",
  "paper-mesh",
  "dot-orbit",
  "noise",
  "voronoi",
  "grain-gradient",
  "warp",
  "static-mesh",
  "smoke-ring",
] as const;

export const SettingsPanel = ({
  settings,
  setSettings,
  defaultSettings,
  image,
  aiColors,
  setAiColors,
  aiGradients,
  setAiGradients,
  isAutoExtracting,
}: SettingsPanelProps) => {
  const { isExtracting, shuffleColors, extractAllFromImage } = useColorExtraction({
    image,
    settings,
    setSettings,
    aiColors,
    setAiColors,
    setAiGradients,
  });

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const isShaderBackground = shaderBackgroundTypes.includes(
    settings.backgroundType as (typeof shaderBackgroundTypes)[number],
  );

  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="flex shrink-0 items-center justify-between border-b border-orange-100/30 p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <div className="h-3.5 w-1.5 rounded-full bg-gradient-to-b from-orange-500 to-amber-500" />
          编辑选项
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={resetSettings}
          className="h-8 w-8 rounded-full text-gray-400 transition-all hover:bg-orange-50 hover:text-orange-500"
          title="重置设置"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="custom-scrollbar relative flex-1 space-y-8 overflow-y-auto p-6 pt-0">
        {/* Background Type */}
        <BackgroundSelector
          value={settings.backgroundType}
          onValueChange={(value) => setSettings((prev) => ({ ...prev, backgroundType: value }))}
        />

        {/* Background Options */}
        {settings.backgroundType === "solid" && (
          <SolidColorSection
            settings={settings}
            setSettings={setSettings}
            aiColors={aiColors}
            onExtract={extractAllFromImage}
            isExtracting={isExtracting}
            isAutoExtracting={isAutoExtracting}
            hasImage={!!image}
          />
        )}

        {settings.backgroundType === "gradient" && (
          <GradientSection
            settings={settings}
            setSettings={setSettings}
            aiGradients={aiGradients}
            onExtract={extractAllFromImage}
            isExtracting={isExtracting}
            isAutoExtracting={isAutoExtracting}
            hasImage={!!image}
          />
        )}

        {isShaderBackground && (
          <ShaderControls
            backgroundType={settings.backgroundType}
            settings={settings}
            setSettings={setSettings}
            aiColors={aiColors}
            onExtract={extractAllFromImage}
            onShuffle={shuffleColors}
            isExtracting={isExtracting}
            isAutoExtracting={isAutoExtracting}
            hasImage={!!image}
          />
        )}

        {settings.backgroundType === "pattern" && (
          <PatternSection settings={settings} setSettings={setSettings} />
        )}

        {settings.backgroundType === "wallpaper" && (
          <WallpaperSection settings={settings} setSettings={setSettings} />
        )}

        {/* Style Controls */}
        <StyleControlsSection settings={settings} setSettings={setSettings} />

        {/* Browser Style */}
        <BrowserStyleSection settings={settings} setSettings={setSettings} />
      </div>
    </div>
  );
};
