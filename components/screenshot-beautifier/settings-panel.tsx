"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorExtractionService } from "@/lib/color-extraction-service";
import { Dices, Loader2, Plus, RotateCcw, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { CompactSlider } from "./compact-slider";
import {
  gradientPresets,
  ImageSettings,
  patternPresets,
  solidColorPresets,
  wallpaperPresets,
} from "./types";

interface SettingsPanelProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
  setWallpaperImage?: any; // Marked as optional/legacy
  defaultSettings: ImageSettings;
  image: HTMLImageElement | null;
  aiColors: string[];
  setAiColors: (colors: string[]) => void;
  aiGradients: Array<{ start: string; end: string }>;
  setAiGradients: (gradients: Array<{ start: string; end: string }>) => void;
  isAutoExtracting: boolean;
}

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
  const wallpaperInputRef = useRef<HTMLInputElement>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setSettings((prev) => ({ ...prev, wallpaperUrl: url }));
    }
  };


  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const extractAllFromImage = async () => {
    if (!image) return;

    setIsExtracting(true);
    try {
      // Convert the HTMLImageElement to a File
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(image, 0, 0);

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9)
      );

      // Create a file from the blob
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

      // Extract everything using the service
      const service = new ColorExtractionService();
      const { colors, gradients } = await service.extractAll(file);

      setAiColors(colors);
      setAiGradients(gradients);
    } catch (error: any) {
      console.error("Error extracting AI data:", error);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-6 border-b border-orange-100/30 flex items-center justify-between shrink-0">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <div className="w-1.5 h-3.5 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"/>
          编辑选项
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={resetSettings}
          className="h-8 w-8 text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all rounded-full"
          title="重置设置"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-8 custom-scrollbar relative">
        {/* Background Type */}
        <section className="sticky top-0 z-20 pt-6 pb-4 bg-white/95 backdrop-blur-xl -mx-6 px-6 border-b border-orange-100/10 space-y-3">
          <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">画布背景</Label>
          <Select
            value={settings.backgroundType}
            onValueChange={(value: "solid" | "gradient" | "pattern" | "wallpaper" | "mesh" | "paper-mesh" | "dot-orbit" | "noise" | "voronoi" | "grain-gradient") =>
              setSettings((prev) => ({ ...prev, backgroundType: value }))
            }
          >
            <SelectTrigger className="w-full bg-gray-50/50 border-gray-100 h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-[10px] text-gray-400">基础背景 (Basic)</SelectLabel>
                <SelectItem value="solid">纯色填充 (Solid)</SelectItem>
                <SelectItem value="gradient">渐变色彩 (Gradient)</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="text-[10px] text-gray-400">艺术着色器 (Shaders)</SelectLabel>
                <SelectItem value="mesh">弥散渐变 (Mesh Gradient ✨)</SelectItem>
                <SelectItem value="paper-mesh">智能弥散 (Paper Mesh 🎨)</SelectItem>
                <SelectItem value="dot-orbit">灵动圆点 (Dot Orbit 🪐)</SelectItem>
                <SelectItem value="noise">噪声艺术 (Simplex Noise 🎨)</SelectItem>
                <SelectItem value="voronoi">泰森多边形 (Voronoi 💎)</SelectItem>
                <SelectItem value="grain-gradient">颗粒渐变 (Grain Gradient 🌊)</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className="text-[10px] text-gray-400">装饰背景 (Decorative)</SelectLabel>
                <SelectItem value="pattern">艺术图案 (Pattern)</SelectItem>
                <SelectItem value="wallpaper">精美壁纸 (Wallpaper)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </section>

        {/* Background Options */}
        {settings.backgroundType === "solid" && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-2.5">
              {solidColorPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setSettings((prev) => ({ ...prev, backgroundColor: preset.color }))}
                  className={`w-full aspect-square rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                    settings.backgroundColor === preset.color ? "border-orange-500 ring-2 ring-orange-500/20" : "border-transparent"
                  }`}
                  style={{ backgroundColor: preset.color, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
                  title={preset.name}
                />
              ))}
            </div>

            {/* AI Color Extraction */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI 智能分析</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={extractAllFromImage}
                  disabled={isExtracting || isAutoExtracting || !image}
                  className="h-6 px-1.5 text-[9px] text-orange-500 hover:bg-orange-50 gap-1"
                >
                  {isExtracting || isAutoExtracting ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-2.5 h-2.5" />
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
                        onClick={() => setSettings((prev) => ({ ...prev, backgroundColor: color }))}
                        className={`w-5 h-5 rounded-full border border-gray-100 transition-all hover:scale-110 ${
                          settings.backgroundColor === color ? "ring-2 ring-orange-500/40 border-orange-500" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
                    <p className="text-[10px] text-orange-600/70 italic leading-relaxed text-center">
                      AI 已根据截图光影自动提取色库
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-2 border border-dashed border-gray-100 rounded-lg text-center">
                   <p className="text-[9px] text-gray-300">正在等待图片分析...</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <div className="relative w-10 h-10 shrink-0">
                <Input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div
                  className="w-full h-full rounded-lg border border-gray-100 shadow-sm"
                  style={{ backgroundColor: settings.backgroundColor }}
                />
              </div>
              <Input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => setSettings((prev) => ({ ...prev, backgroundColor: e.target.value }))}
                className="flex-1 h-10 text-xs bg-gray-50/50 border-gray-100"
                placeholder="#HEXCOLOR"
              />
            </div>
          </div>
        )}

        {settings.backgroundType === "gradient" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {gradientPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setSettings((prev) => ({ ...prev, gradientStart: preset.start, gradientEnd: preset.end }))}
                  className="h-10 rounded-lg border border-gray-100 transition-all hover:scale-[1.02] active:scale-95"
                  style={{ background: `linear-gradient(45deg, ${preset.start}, ${preset.end})` }}
                />
              ))}
            </div>
            
            {/* AI Gradient Extraction */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI 智能渐变</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={extractAllFromImage}
                  disabled={isExtracting || isAutoExtracting || !image}
                  className="h-6 px-1.5 text-[9px] text-orange-500 hover:bg-orange-50 gap-1"
                >
                  {isExtracting || isAutoExtracting ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-2.5 h-2.5" />
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
                        onClick={() => setSettings((prev) => ({ ...prev, gradientStart: gradient.start, gradientEnd: gradient.end }))}
                        className="h-8 rounded-lg border border-gray-100 transition-all hover:scale-[1.02] shadow-sm"
                        style={{ background: `linear-gradient(45deg, ${gradient.start}, ${gradient.end})` }}
                      />
                    ))}
                  </div>
                  <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
                    <p className="text-[10px] text-orange-600/70 italic leading-relaxed text-center">
                      AI 已根据截图氛围推荐最佳色彩过渡
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-2 border border-dashed border-gray-100 rounded-lg text-center">
                   <p className="text-[9px] text-gray-300">正在等待渐变匹配...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {(settings.backgroundType === "paper-mesh" || settings.backgroundType === "dot-orbit" || settings.backgroundType === "noise" || settings.backgroundType === "voronoi" || settings.backgroundType === "grain-gradient") && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 text-center">
             <div className="flex justify-between items-center px-1">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">高级着色器控制</Label>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                        await extractAllFromImage();
                    }}
                    disabled={isExtracting || isAutoExtracting || !image}
                    className="h-6 px-1.5 text-[9px] text-orange-500 hover:bg-orange-50 gap-1"
                >
                    {isExtracting || isAutoExtracting ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    同步 AI 色彩
                </Button>
              </div>

              <div className="space-y-3">
                <CompactSlider
                    label="速度"
                    valueDisplay={settings.shaderSpeed.toFixed(2)}
                    value={[settings.shaderSpeed]}
                    onValueChange={([v]) => setSettings(p => ({ ...p, shaderSpeed: v }))}
                    min={0}
                    max={1}
                    step={0.01}
                />

                {settings.backgroundType === "paper-mesh" && (
                    <>
                        <CompactSlider
                            label="扭曲"
                            valueDisplay={settings.shaderDistortion.toFixed(1)}
                            value={[settings.shaderDistortion]}
                            onValueChange={([v]) => setSettings(p => ({ ...p, shaderDistortion: v }))}
                            min={0}
                            max={2}
                            step={0.1}
                        />
                        <CompactSlider
                            label="旋涡"
                            valueDisplay={settings.shaderSwirl.toFixed(1)}
                            value={[settings.shaderSwirl]}
                            onValueChange={([v]) => setSettings(p => ({ ...p, shaderSwirl: v }))}
                            min={0}
                            max={2}
                            step={0.1}
                        />
                    </>
                )}

                {(settings.backgroundType === "dot-orbit" || settings.backgroundType === "noise" || settings.backgroundType === "voronoi" || settings.backgroundType === "grain-gradient") && (
                    <CompactSlider
                        label="比例"
                        valueDisplay={settings.shaderScale.toFixed(1)}
                        value={[settings.shaderScale]}
                        onValueChange={([v]) => setSettings(p => ({ ...p, shaderScale: v }))}
                        min={0.1}
                        max={4}
                        step={0.1}
                    />
                )}

                {settings.backgroundType === "noise" && (
                    <>
                        <CompactSlider
                            label="步数"
                            valueDisplay={settings.noiseSteps.toString()}
                            value={[settings.noiseSteps]}
                            onValueChange={([v]) => setSettings(p => ({ ...p, noiseSteps: v }))}
                            min={1}
                            max={5}
                            step={1}
                        />
                        <CompactSlider
                            label="柔化"
                            valueDisplay={settings.noiseSoftness.toFixed(2)}
                            value={[settings.noiseSoftness]}
                            onValueChange={([v]) => setSettings(p => ({ ...p, noiseSoftness: v }))}
                            min={0}
                            max={1}
                            step={0.01}
                        />
                    </>
                )}

                {settings.backgroundType === "voronoi" && (
                    <>
                        <CompactSlider
                            label="步数"
                            valueDisplay={settings.voronoiSteps.toString()}
                            value={[settings.voronoiSteps]}
                            onValueChange={([v]) => setSettings(p => ({ ...p, voronoiSteps: v }))}
                            min={1}
                            max={10}
                            step={1}
                        />
                        <CompactSlider
                            label="扭曲"
                            valueDisplay={settings.voronoiDistortion.toFixed(2)}
                            value={[settings.voronoiDistortion]}
                            onValueChange={([v]) => setSettings(p => ({ ...p, voronoiDistortion: v }))}
                            min={0}
                            max={2}
                            step={0.1}
                        />
                        <CompactSlider
                            label="间隙"
                            valueDisplay={settings.voronoiGap.toFixed(2)}
                            value={[settings.voronoiGap]}
                            onValueChange={([v]) => setSettings(p => ({ ...p, voronoiGap: v }))}
                            min={0}
                            max={0.5}
                            step={0.01}
                        />
                        <CompactSlider
                            label="发光"
                            valueDisplay={settings.voronoiGlow.toFixed(2)}
                            value={[settings.voronoiGlow]}
                            onValueChange={([v]) => setSettings(p => ({ ...p, voronoiGlow: v }))}
                            min={0}
                            max={1}
                            step={0.01}
                        />
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="space-y-2">
                                <Label className="text-[10px] text-gray-400">发光色</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="color"
                                        value={settings.voronoiGlowColor}
                                        onChange={(e) => setSettings(p => ({ ...p, voronoiGlowColor: e.target.value }))}
                                        className="w-6 h-6 p-0 border-none bg-transparent"
                                    />
                                    <Input
                                        type="text"
                                        value={settings.voronoiGlowColor}
                                        onChange={(e) => setSettings(p => ({ ...p, voronoiGlowColor: e.target.value }))}
                                        className="flex-1 h-7 text-[9px] bg-gray-50/50 border-gray-100"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] text-gray-400">间隙色</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="color"
                                        value={settings.voronoiGapColor}
                                        onChange={(e) => setSettings(p => ({ ...p, voronoiGapColor: e.target.value }))}
                                        className="w-6 h-6 p-0 border-none bg-transparent"
                                    />
                                    <Input
                                        type="text"
                                        value={settings.voronoiGapColor}
                                        onChange={(e) => setSettings(p => ({ ...p, voronoiGapColor: e.target.value }))}
                                        className="flex-1 h-7 text-[9px] bg-gray-50/50 border-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {(settings.backgroundType === "dot-orbit" || settings.backgroundType === "grain-gradient") && (
                    <div className="space-y-2 pt-2">
                        <Label className="text-[10px] text-gray-400">底色 (Background)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="color"
                                value={settings.shaderColorBack}
                                onChange={(e) => setSettings(p => ({ ...p, shaderColorBack: e.target.value }))}
                                className="w-8 h-8 p-0 border-none bg-transparent"
                            />
                            <Input
                                type="text"
                                value={settings.shaderColorBack}
                                onChange={(e) => setSettings(p => ({ ...p, shaderColorBack: e.target.value }))}
                                className="flex-1 h-8 text-[10px] bg-gray-50/50 border-gray-100"
                            />
                        </div>
                    </div>
                )}

                {settings.backgroundType === "grain-gradient" && (
                    <>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <Label className="text-[10px] text-gray-400">形状</Label>
                                <span className="text-[9px] tabular-nums text-gray-400 uppercase">{settings.grainShape}</span>
                            </div>
                            <Select
                                value={settings.grainShape}
                                onValueChange={(value: any) => setSettings(p => ({ ...p, grainShape: value }))}
                            >
                                <SelectTrigger className="w-full bg-gray-50/50 border-gray-100 h-8 text-[10px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="wave">Wave</SelectItem>
                                    <SelectItem value="dots">Dots</SelectItem>
                                    <SelectItem value="truchet">Truchet</SelectItem>
                                    <SelectItem value="corners">Corners</SelectItem>
                                    <SelectItem value="ripple">Ripple</SelectItem>
                                    <SelectItem value="blob">Blob</SelectItem>
                                    <SelectItem value="sphere">Sphere</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <CompactSlider
                            label="柔化"
                            valueDisplay={settings.grainSoftness.toFixed(2)}
                            value={[settings.grainSoftness]}
                            onValueChange={([v]) => setSettings(p => ({ ...p, grainSoftness: v }))}
                            min={0}
                            max={1}
                            step={0.01}
                        />
                        <CompactSlider
                            label="强度"
                            valueDisplay={settings.grainIntensity.toFixed(2)}
                            value={[settings.grainIntensity]}
                            onValueChange={([v]) => setSettings(p => ({ ...p, grainIntensity: v }))}
                            min={0}
                            max={1}
                            step={0.01}
                        />
                        <CompactSlider
                            label="噪点"
                            valueDisplay={settings.grainNoise.toFixed(2)}
                            value={[settings.grainNoise]}
                            onValueChange={([v]) => setSettings(p => ({ ...p, grainNoise: v }))}
                            min={0}
                            max={1}
                            step={0.01}
                        />
                    </>
                )}
              </div>

              <div className="space-y-3">
                 <p className="text-[9px] text-gray-400 px-1 text-center">色彩配置 (AI 同步或预设)</p>
                 <div className="flex flex-wrap gap-2 px-1 justify-center">
                    {(aiColors.length > 0 ? aiColors : solidColorPresets.slice(0, 8).map(p => p.color)).map((color, i) => (
                        <div
                            key={i}
                            className="w-5 h-5 rounded-full border border-gray-100 shadow-sm"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                 </div>
                 <p className="text-[9px] text-gray-600/60 italic leading-relaxed px-1 text-center">
                    使用上方“同步 AI 色彩”将截图氛围注入着色器
                 </p>
              </div>
          </div>
        )}

        {settings.backgroundType === "mesh" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
             <div className="flex justify-between items-center px-1">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">弥散质感</Label>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                            await extractAllFromImage();
                        }}
                        disabled={isExtracting || isAutoExtracting || !image}
                        className="h-6 px-1.5 text-[9px] text-orange-500 hover:bg-orange-50 gap-1"
                    >
                        {isExtracting || isAutoExtracting ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        AI 提取
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSettings(prev => ({ ...prev, meshSeed: prev.meshSeed + 1 }))}
                        className="h-6 px-1.5 text-[9px] text-gray-400 hover:bg-gray-100 gap-1"
                    >
                        <Dices className="w-3 h-3" />
                        随机
                    </Button>
                </div>
              </div>
            
            <div className="grid grid-cols-5 gap-2.5 min-h-[32px]">
              {solidColorPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setSettings((prev) => ({ ...prev, backgroundColor: preset.color }))}
                  className={`w-full aspect-square rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                    settings.backgroundColor === preset.color? "border-orange-500 ring-2 ring-orange-500/20" : "border-transparent"
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.name}
                />
              ))}
            </div>

            {/* Mesh Specific Colors (AI/Results) */}
            {aiColors.length > 0 && (
                <div className="pt-2 border-t border-gray-50">
                    <p className="text-[9px] text-gray-400 mb-2 px-1">AI 建议色彩库</p>
                    <div className="flex flex-wrap gap-2">
                        {aiColors.map((color, i) => (
                            <div
                                key={i}
                                className="w-4 h-4 rounded-full border border-gray-100"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                        <Button
                            variant="link"
                            className="h-4 p-0 text-[9px] text-orange-500"
                            onClick={() => setSettings(p => ({ ...p, meshColors: aiColors }))}
                        >
                            应用到渐变
                        </Button>
                    </div>
                </div>
            )}

            <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 p-4 rounded-2xl border border-orange-100/50 flex flex-col items-center gap-2">
              <p className="text-[10px] text-amber-700/60 font-medium leading-relaxed text-center">
                磨砂层已叠加 3% 的艺术噪点<br/>以实现电影级的背景平滑度
              </p>
            </div>
          </div>
        )}

        {settings.backgroundType === "pattern" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {patternPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setSettings((prev) => ({ ...prev, backgroundColor: preset.color }))}
                  className={`h-12 rounded-xl border-2 text-[11px] font-bold transition-all ${
                    settings.backgroundColor === preset.color ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-100 bg-gray-50 text-gray-400"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {settings.backgroundType === "wallpaper" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {wallpaperPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => setSettings((prev) => ({ ...prev, wallpaperUrl: preset.url }))}
                  className={`aspect-[16/10] rounded-lg border-2 overflow-hidden transition-all hover:scale-[1.02] ${
                    settings.wallpaperUrl === preset.url ? "border-orange-500 ring-2 ring-orange-500/20" : "border-gray-100"
                  }`}
                >
                  <img src={preset.thumbnail || "/placeholder.svg"} alt={preset.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => wallpaperInputRef.current?.click()}
              className="w-full h-10 text-xs border-dashed text-gray-500 hover:text-orange-500 hover:border-orange-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              上传自定义壁纸
            </Button>
            <input ref={wallpaperInputRef} type="file" accept="image/*" onChange={handleWallpaperUpload} className="hidden" />
          </div>
        )}

        {/* Style Controls */}
        <section className="space-y-6 pt-6 border-t border-gray-50">
          <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">截图样式</Label>

          <div className="space-y-3">
            <CompactSlider
              label="圆角"
              valueDisplay={`${settings.borderRadius}px`}
              value={[settings.borderRadius]}
              onValueChange={([value]) => setSettings((prev) => ({ ...prev, borderRadius: value }))}
              max={100}
              step={1}
            />

            <CompactSlider
              label="内边距"
              valueDisplay={`${settings.padding}px`}
              value={[settings.padding]}
              onValueChange={([value]) => setSettings((prev) => ({ ...prev, padding: value }))}
              max={400}
              step={10}
            />

            <CompactSlider
              label="缩放"
              valueDisplay={`${Math.round(settings.scale * 100)}%`}
              value={[settings.scale]}
              onValueChange={([value]) => setSettings((prev) => ({ ...prev, scale: value }))}
              min={0.1}
              max={3}
              step={0.1}
            />

            <CompactSlider
              label="阴影"
              valueDisplay={`${settings.shadow}px`}
              value={[settings.shadow]}
              onValueChange={([value]) => setSettings((prev) => ({ ...prev, shadow: value }))}
              max={50}
              step={1}
            />
          </div>
        </section>

        {/* Browser Style */}
        <section className="space-y-3 pt-6 border-t border-gray-50 pb-8">
          <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">外观装饰</Label>
          <Select
            value={settings.browserStyle}
            onValueChange={(value: "none" | "chrome" | "safari") =>
              setSettings((prev) => ({ ...prev, browserStyle: value }))
            }
          >
            <SelectTrigger className="w-full bg-gray-50/50 border-gray-100 h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">无窗口装饰 (None)</SelectItem>
              <SelectItem value="chrome">Chrome 浏览器</SelectItem>
              <SelectItem value="safari">Safari 浏览器</SelectItem>
            </SelectContent>
          </Select>
        </section>
      </div>
    </div>
  );
}; 