"use client";

import { Button } from "@/components/ui/button";
import { Dices, Loader2, Shuffle, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ImageSettings, solidColorPresets } from "../../types";

interface MeshControlsProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
  aiColors: string[];
  onExtract: () => void;
  onShuffle: () => void;
  isExtracting: boolean;
  isAutoExtracting: boolean;
  hasImage: boolean;
}

export const MeshControls = ({
  settings,
  setSettings,
  aiColors,
  onExtract,
  onShuffle,
  isExtracting,
  isAutoExtracting,
  hasImage,
}: MeshControlsProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between px-1">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          弥散质感
        </Label>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onShuffle}
            disabled={aiColors.length < 2 || isExtracting || isAutoExtracting}
            className="h-6 gap-1 px-1.5 text-[9px] text-gray-500 hover:bg-gray-100"
            title="改变颜色顺序"
          >
            <Shuffle className="h-3 w-3" />
            改变顺序
          </Button>
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
              <Sparkles className="h-3 w-3" />
            )}
            AI 提取
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                meshSeed: prev.meshSeed + 1,
              }))
            }
            className="h-6 gap-1 px-1.5 text-[9px] text-gray-400 hover:bg-gray-100"
          >
            <Dices className="h-3 w-3" />
            随机
          </Button>
        </div>
      </div>

      <div className="grid min-h-[32px] grid-cols-5 gap-2.5">
        {solidColorPresets.map((preset, index) => (
          <button
            key={index}
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                backgroundColor: preset.color,
              }))
            }
            className={`aspect-square w-full rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
              settings.backgroundColor === preset.color
                ? "border-orange-500 ring-2 ring-orange-500/20"
                : "border-transparent"
            }`}
            style={{ backgroundColor: preset.color }}
            title={preset.name}
          />
        ))}
      </div>

      {/* Mesh Specific Colors (AI/Results) */}
      {aiColors.length > 0 && (
        <div className="border-t border-gray-50 pt-2">
          <p className="mb-2 px-1 text-[9px] text-gray-400">AI 建议色彩库</p>
          <div className="flex flex-wrap gap-2">
            {aiColors.map((color, i) => (
              <div
                key={i}
                className="h-4 w-4 rounded-full border border-gray-100"
                style={{ backgroundColor: color }}
              />
            ))}
            <Button
              variant="link"
              className="h-4 p-0 text-[9px] text-orange-500"
              onClick={() => setSettings((p) => ({ ...p, meshColors: aiColors }))}
            >
              应用到渐变
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-2 rounded-2xl border border-orange-100/50 bg-gradient-to-br from-orange-50/50 to-amber-50/50 p-4">
        <p className="text-center text-[10px] font-medium leading-relaxed text-amber-700/60">
          磨砂层已叠加 3% 的艺术噪点
          <br />
          以实现电影级的背景平滑度
        </p>
      </div>
    </div>
  );
};
