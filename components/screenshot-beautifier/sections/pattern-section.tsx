"use client";

import { ImageSettings, patternPresets } from "../types";

interface PatternSectionProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
}

export const PatternSection = ({ settings, setSettings }: PatternSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {patternPresets.map((preset, index) => (
          <button
            key={index}
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                backgroundColor: preset.color,
              }))
            }
            className={`h-12 rounded-xl border-2 text-[11px] font-bold transition-all ${
              settings.backgroundColor === preset.color
                ? "border-orange-500 bg-orange-50 text-orange-600"
                : "border-gray-100 bg-gray-50 text-gray-400"
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};
