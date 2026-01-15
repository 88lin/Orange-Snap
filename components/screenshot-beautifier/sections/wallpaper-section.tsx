"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { ImageSettings, wallpaperPresets } from "../types";

interface WallpaperSectionProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
}

export const WallpaperSection = ({ settings, setSettings }: WallpaperSectionProps) => {
  const wallpaperInputRef = useRef<HTMLInputElement>(null);

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setSettings((prev) => ({ ...prev, wallpaperUrl: url }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {wallpaperPresets.map((preset, index) => (
          <button
            key={index}
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                wallpaperUrl: preset.url,
              }))
            }
            className={`aspect-[16/10] overflow-hidden rounded-lg border-2 transition-all hover:scale-[1.02] ${
              settings.wallpaperUrl === preset.url
                ? "border-orange-500 ring-2 ring-orange-500/20"
                : "border-gray-100"
            }`}
          >
            <img
              src={preset.thumbnail || "/placeholder.svg"}
              alt={preset.name}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => wallpaperInputRef.current?.click()}
        className="h-10 w-full border-dashed text-xs text-gray-500 hover:border-orange-300 hover:text-orange-500"
      >
        <Plus className="mr-2 h-4 w-4" />
        上传自定义壁纸
      </Button>
      <input
        ref={wallpaperInputRef}
        type="file"
        accept="image/*"
        onChange={handleWallpaperUpload}
        className="hidden"
      />
    </div>
  );
};
