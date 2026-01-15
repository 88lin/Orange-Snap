"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { gradientPresets, ImageSettings } from "../types";

interface GradientSectionProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
  aiGradients: Array<{ start: string; end: string }>;
  onExtract: () => void;
  isExtracting: boolean;
  isAutoExtracting: boolean;
  hasImage: boolean;
}

export const GradientSection = ({
  settings: _settings,
  setSettings,
  aiGradients,
  onExtract,
  isExtracting,
  isAutoExtracting,
  hasImage,
}: GradientSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {gradientPresets.map((preset, index) => (
          <button
            key={index}
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                gradientStart: preset.start,
                gradientEnd: preset.end,
              }))
            }
            className="h-10 rounded-lg border border-gray-100 transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: `linear-gradient(45deg, ${preset.start}, ${preset.end})`,
            }}
          />
        ))}
      </div>

      {/* AI Gradient Extraction */}
      <div className="space-y-4 border-t border-gray-50 pt-4">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            AI 智能渐变
          </Label>
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
              <Sparkles className="h-2.5 w-2.5" />
            )}
            重新匹配
          </Button>
        </div>

        {aiGradients.length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5 px-1">
              {aiGradients.map((gradient, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      gradientStart: gradient.start,
                      gradientEnd: gradient.end,
                    }))
                  }
                  className="h-8 rounded-lg border border-gray-100 shadow-sm transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(45deg, ${gradient.start}, ${gradient.end})`,
                  }}
                />
              ))}
            </div>
            <div className="rounded-xl border border-orange-100/50 bg-orange-50/50 p-3">
              <p className="text-center text-[10px] italic leading-relaxed text-orange-600/70">
                AI 已根据截图氛围推荐最佳色彩过渡
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-100 py-2 text-center">
            <p className="text-[9px] text-gray-300">正在等待渐变匹配...</p>
          </div>
        )}
      </div>
    </div>
  );
};
