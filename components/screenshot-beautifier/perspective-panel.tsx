"use client";

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
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-6 border-b border-orange-100/30 shrink-0">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <div className="w-1.5 h-3.5 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"/>
          呈现样式
        </h3>
        <p className="text-[10px] text-gray-400 mt-1.5">选择最适合的截图展示角度</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
        <div className="grid grid-cols-1 gap-2.5">
          {perspectivePresets.map((preset, index) => (
            <button
              key={index}
              className={`group relative text-left p-3 rounded-xl border transition-all duration-300 ${
                settings.rotateX === preset.rotateX &&
                settings.rotateY === preset.rotateY &&
                settings.rotateZ === preset.rotateZ &&
                settings.tilt === preset.tilt
                  ? "border-orange-500 bg-orange-50/30 ring-1 ring-orange-500/10"
                  : "border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/50"
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
                <div className="w-12 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden group-hover:bg-white transition-colors">
                  <div
                    className={`w-7 h-4 border-1.5 rounded-[1px] transition-all duration-500 ${
                      settings.rotateX === preset.rotateX ? "border-orange-500 bg-orange-100/50" : "border-gray-300 bg-gray-100/50"
                    }`}
                    style={{
                      transformOrigin: "center center",
                      transform: `perspective(30px) rotateX(${preset.rotateX}deg) rotateY(${preset.rotateY}deg) rotateZ(${preset.rotateZ}deg) skew(${preset.tilt}deg, 0deg)`
                    }}
                  />
                </div>
                <div>
                  <div className={`text-xs font-semibold ${settings.rotateX === preset.rotateX ? "text-orange-600" : "text-gray-700"}`}>
                    {preset.name}
                  </div>
                  <div className="text-[9px] text-gray-400 mt-0.5">
                    {preset.rotateY}° / {preset.rotateX}° / {preset.tilt}°
                  </div>
                </div>
              </div>
              
              {settings.rotateX === preset.rotateX && (
                <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {!image && (
        <div className="p-6 pt-0 shrink-0">
          <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 rounded-2xl p-4 border border-orange-100/50">
            <p className="text-[10px] text-amber-700/70 font-medium text-center leading-relaxed">
              💡 建议使用高分辨率原始截图<br/>以获得最佳 3D 渲染质感
            </p>
          </div>
        </div>
      )}
    </div>
  );
};