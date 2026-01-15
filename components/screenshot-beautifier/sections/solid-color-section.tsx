"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { ImageSettings, solidColorPresets } from "../types";

interface SolidColorSectionProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
  aiColors: string[];
  onExtract: () => void;
  isExtracting: boolean;
  isAutoExtracting: boolean;
  hasImage: boolean;
}

export const SolidColorSection = ({
  settings,
  setSettings,
  aiColors,
  onExtract,
  isExtracting,
  isAutoExtracting,
  hasImage,
}: SolidColorSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-2.5">
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
            style={{
              backgroundColor: preset.color,
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            }}
            title={preset.name}
          />
        ))}
      </div>

      {/* AI Color Extraction */}
      <div className="space-y-4 border-t border-gray-50 pt-4">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            AI 智能分析
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
            重新采样
          </Button>
        </div>

        {aiColors.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 px-1">
              {aiColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      backgroundColor: color,
                    }))
                  }
                  className={`h-5 w-5 rounded-full border border-gray-100 transition-all hover:scale-110 ${
                    settings.backgroundColor === color
                      ? "border-orange-500 ring-2 ring-orange-500/40"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="rounded-xl border border-orange-100/50 bg-orange-50/50 p-3">
              <p className="text-center text-[10px] italic leading-relaxed text-orange-600/70">
                AI 已根据截图光影自动提取色库
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-100 py-2 text-center">
            <p className="text-[9px] text-gray-300">正在等待图片分析...</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <div className="relative h-10 w-10 shrink-0">
          <Input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                backgroundColor: e.target.value,
              }))
            }
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <div
            className="h-full w-full rounded-lg border border-gray-100 shadow-sm"
            style={{ backgroundColor: settings.backgroundColor }}
          />
        </div>
        <Input
          type="text"
          value={settings.backgroundColor}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              backgroundColor: e.target.value,
            }))
          }
          className="h-10 flex-1 border-gray-100 bg-gray-50/50 text-xs"
          placeholder="#HEXCOLOR"
        />
      </div>
    </div>
  );
};
