"use client";

import { ImageSettings, perspectivePresets } from "./types";

interface PerspectivePanelProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
  image: HTMLImageElement | null;
}

export const PerspectivePanel = ({ settings, setSettings, image }: PerspectivePanelProps) => {
  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="shrink-0 border-b border-orange-100/30 p-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <div className="h-3.5 w-1.5 rounded-full bg-gradient-to-b from-orange-500 to-amber-500" />
          呈现样式
        </h3>
        <p className="mt-1.5 text-[10px] text-gray-400">选择最适合的截图展示角度</p>
      </div>

      <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-5">
        <div className="grid grid-cols-1 gap-2.5">
          {perspectivePresets.map((preset, index) => (
            <button
              key={index}
              className={`group relative rounded-xl border p-3 text-left transition-all duration-300 ${
                settings.rotateX === preset.rotateX &&
                settings.rotateY === preset.rotateY &&
                settings.rotateZ === preset.rotateZ &&
                settings.tilt === preset.tilt
                  ? "border-orange-500 bg-orange-50/30 ring-1 ring-orange-500/10"
                  : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50"
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
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50 transition-colors group-hover:bg-white">
                  <div
                    className={`border-1.5 h-4 w-7 rounded-[1px] transition-all duration-500 ${
                      settings.rotateX === preset.rotateX
                        ? "border-orange-500 bg-orange-100/50"
                        : "border-gray-300 bg-gray-100/50"
                    }`}
                    style={{
                      transformOrigin: "center center",
                      transform: `perspective(30px) rotateX(${preset.rotateX}deg) rotateY(${preset.rotateY}deg) rotateZ(${preset.rotateZ}deg) skew(${preset.tilt}deg, 0deg)`,
                    }}
                  />
                </div>
                <div>
                  <div
                    className={`text-xs font-semibold ${settings.rotateX === preset.rotateX ? "text-orange-600" : "text-gray-700"}`}
                  >
                    {preset.name}
                  </div>
                  <div className="mt-0.5 text-[9px] text-gray-400">
                    {preset.rotateY}° / {preset.rotateX}° / {preset.tilt}°
                  </div>
                </div>
              </div>

              {settings.rotateX === preset.rotateX && (
                <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {!image && (
        <div className="shrink-0 p-6 pt-0">
          <div className="rounded-2xl border border-orange-100/50 bg-gradient-to-br from-orange-50/50 to-amber-50/50 p-4">
            <p className="text-center text-[10px] font-medium leading-relaxed text-amber-700/70">
              💡 建议使用高分辨率原始截图
              <br />
              以获得最佳 3D 渲染质感
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
