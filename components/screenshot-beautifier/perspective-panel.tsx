"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageSettings, perspectivePresets } from "./types";

interface PerspectivePanelProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
  image: HTMLImageElement | null;
}

export const PerspectivePanel = ({
  settings,
  setSettings,
  image,
}: PerspectivePanelProps) => {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg h-full overflow-y-auto">
      <CardContent className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">呈现样式</h3>
        </div>

        {/* Presets */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {perspectivePresets.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`text-xs h-20 flex flex-col items-center justify-center gap-2 transition-all ${
                  settings.rotateX === preset.rotateX &&
                  settings.rotateY === preset.rotateY &&
                  settings.rotateZ === preset.rotateZ &&
                  settings.tilt === preset.tilt
                    ? "border-orange-400 bg-orange-50 text-orange-600 shadow-inner"
                    : "hover:border-orange-200 bg-white/50"
                }`}
                onClick={() => {
                  setSettings((prev) => ({
                    ...prev,
                    rotateX: preset.rotateX,
                    rotateY: preset.rotateY,
                    rotateZ: preset.rotateZ,
                    tilt: preset.tilt,
                  }));
                }}
              >
                <div className="relative w-full h-8 flex items-center justify-center overflow-hidden">
                   <div 
                    className="w-12 h-7 border-2 border-current rounded-sm opacity-40 bg-current/5"
                    style={{
                      transformOrigin: "center center",
                      transform: `perspective(60px) rotateX(${preset.rotateX}deg) rotateY(${preset.rotateY}deg) rotateZ(${preset.rotateZ}deg) skew(${preset.tilt}deg, 0deg)`
                    }}
                  />
                </div>
                <span className="font-medium">{preset.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {!image && (
          <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-100">
            <p className="text-[10px] text-orange-400 text-center leading-relaxed">
              上传图片后<br/>预览更佳效果
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};