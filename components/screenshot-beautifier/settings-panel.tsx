"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { ColorExtractionService } from "@/lib/color-extraction-service";
import { Loader2, Plus, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
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
}

export const SettingsPanel = ({
  settings,
  setSettings,
  defaultSettings,
  image,
}: SettingsPanelProps) => {
  const wallpaperInputRef = useRef<HTMLInputElement>(null);
  const [isExtractingColors, setIsExtractingColors] = useState(false);
  const [aiColors, setAiColors] = useState<string[]>([]);
  const [aiGradients, setAiGradients] = useState<Array<{ start: string; end: string }>>([]);
  const [isExtractingGradients, setIsExtractingGradients] = useState(false);

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setSettings((prev) => ({ ...prev, wallpaperUrl: url }));
    }
  };


  const resetSettings = () => {
    setSettings(defaultSettings);
    toast({
      title: "已重置 🔄",
      description: "所有设置已恢复默认",
    });
  };

  const extractColorsFromImage = async () => {
    if (!image) {
      toast({
        title: "未检测到图片",
        description: "请先上传一张图片",
        variant: "destructive",
      });
      return;
    }

    setIsExtractingColors(true);
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
      
      // Extract colors using the service (no need to pass API key or baseUrl)
      const service = new ColorExtractionService();
      const colors = await service.extractColors(file);
      
      setAiColors(colors);
      
      toast({
        title: "颜色提取成功 ✨",
        description: "已从图片中提取主要颜色",
      });
    } catch (error: any) {
      console.error("Error extracting colors:", error);
      toast({
        title: "颜色提取失败",
        description: error.message || "无法从图片中提取颜色",
        variant: "destructive",
      });
    } finally {
      setIsExtractingColors(false);
    }
  };

  const extractGradientsFromImage = async () => {
    if (!image) {
      toast({
        title: "未检测到图片",
        description: "请先上传一张图片",
        variant: "destructive",
      });
      return;
    }

    setIsExtractingGradients(true);
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
      
      // Extract gradients using the service
      const service = new ColorExtractionService();
      const gradients = await service.extractGradients(file);
      
      setAiGradients(gradients);
      
      toast({
        title: "渐变提取成功 ✨",
        description: "已从图片中提取渐变色彩",
      });
    } catch (error: any) {
      console.error("Error extracting gradients:", error);
      toast({
        title: "渐变提取失败",
        description: error.message || "无法从图片中提取渐变色彩",
        variant: "destructive",
      });
    } finally {
      setIsExtractingGradients(false);
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

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Background Type */}
        <section className="space-y-3">
          <Label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">画布背景</Label>
          <Select
            value={settings.backgroundType}
            onValueChange={(value: "solid" | "gradient" | "pattern" | "wallpaper") =>
              setSettings((prev) => ({ ...prev, backgroundType: value }))
            }
          >
            <SelectTrigger className="w-full bg-gray-50/50 border-gray-100 h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">纯色填充 (Solid)</SelectItem>
              <SelectItem value="gradient">渐变色彩 (Gradient)</SelectItem>
              <SelectItem value="pattern">艺术图案 (Pattern)</SelectItem>
              <SelectItem value="wallpaper">精美壁纸 (Wallpaper)</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Background Options */}
        {settings.backgroundType === "solid" && (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-2.5">
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
                <Label className="text-[10px] font-bold text-gray-400">AI 智能提取色彩</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={extractColorsFromImage}
                  disabled={isExtractingColors || !image}
                  className="h-8 px-2 text-xs text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                >
                  {isExtractingColors ? <Loader2 className="h-3 w-3 animate-spin" /> : "开始提取"}
                </Button>
              </div>

              <div className="grid grid-cols-5 gap-2.5 min-h-[32px]">
                {aiColors.length > 0 ? aiColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSettings((prev) => ({ ...prev, backgroundColor: color }))}
                    className={`w-full aspect-square rounded-full border-2 transition-all ${
                      settings.backgroundColor === color ? "border-orange-500 ring-2 ring-orange-500/20" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                )) : (
                  <div className="col-span-5 text-center py-2 border border-dashed border-gray-100 rounded-lg">
                     <p className="text-[9px] text-gray-300 uppercase tracking-tighter">暂无 AI 色彩数据</p>
                  </div>
                )}
              </div>
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
                <Label className="text-[10px] font-bold text-gray-400">AI 智能提取渐变</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={extractGradientsFromImage}
                  disabled={isExtractingGradients || !image}
                  className="h-8 px-2 text-xs text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                >
                  {isExtractingGradients ? <Loader2 className="h-3 w-3 animate-spin" /> : "智能匹配"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 min-h-[40px]">
                {aiGradients.length > 0 ? aiGradients.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => setSettings((prev) => ({ ...prev, gradientStart: gradient.start, gradientEnd: gradient.end }))}
                    className="h-10 rounded-lg border border-gray-100 transition-all hover:scale-[1.02]"
                    style={{ background: `linear-gradient(45deg, ${gradient.start}, ${gradient.end})` }}
                  />
                )) : (
                  <div className="col-span-2 text-center py-4 border border-dashed border-gray-100 rounded-lg">
                     <p className="text-[9px] text-gray-300 uppercase tracking-tighter">上传截图后可提取渐变</p>
                  </div>
                )}
              </div>
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
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-medium text-gray-600">圆角</Label>
                <span className="text-[10px] tabular-nums text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{settings.borderRadius}px</span>
              </div>
              <Slider
                value={[settings.borderRadius]}
                onValueChange={([value]) => setSettings((prev) => ({ ...prev, borderRadius: value }))}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-medium text-gray-600">内边距</Label>
                <span className="text-[10px] tabular-nums text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{settings.padding}px</span>
              </div>
              <Slider
                value={[settings.padding]}
                onValueChange={([value]) => setSettings((prev) => ({ ...prev, padding: value }))}
                max={400}
                step={10}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-medium text-gray-600">缩放</Label>
                <span className="text-[10px] tabular-nums text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{Math.round(settings.scale * 100)}%</span>
              </div>
              <Slider
                value={[settings.scale]}
                onValueChange={([value]) => setSettings((prev) => ({ ...prev, scale: value }))}
                min={0.1}
                max={3}
                step={0.1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-medium text-gray-600">阴影</Label>
                <span className="text-[10px] tabular-nums text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{settings.shadow}px</span>
              </div>
              <Slider
                value={[settings.shadow]}
                onValueChange={([value]) => setSettings((prev) => ({ ...prev, shadow: value }))}
                max={50}
                step={1}
              />
            </div>
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