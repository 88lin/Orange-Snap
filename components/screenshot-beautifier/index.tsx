"use client";

import { toast } from "@/hooks/use-toast";
import { Github } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasRenderer } from "./canvas-renderer";
import { ImagePreview } from "./image-preview";
import { PerspectivePanel } from "./perspective-panel";
import { SettingsPanel } from "./settings-panel";
import { defaultSettings, ImageSettings } from "./types";

export function ScreenshotBeautifier() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<ImageSettings>(defaultSettings);
  const [wallpaperImage, setWallpaperImage] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 处理粘贴事件
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const img = new Image();
          img.onload = () => setImage(img);
          img.src = URL.createObjectURL(file);
          toast({
            title: "图片已添加 ✨",
            description: "开始美化您的截图吧！",
          });
        }
        break;
      }
    }
  }, []);

  // 触发文件选择
  const triggerFileSelection = useCallback(() => {
    // 创建一个新的文件输入元素动态确保它可以正常工作
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = URL.createObjectURL(file);
        
        toast({
          title: "图片已更新 ✨",
          description: "已重新选择图片进行美化",
        });
      }
    };
    // 触发点击打开文件对话框
    input.click();
  }, []);

  // 监听粘贴事件
  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  // 监听壁纸URL变更
  useEffect(() => {
    if (settings.wallpaperUrl && settings.backgroundType === "wallpaper") {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => setWallpaperImage(img);
      img.onerror = () => {
        toast({
          title: "壁纸加载失败",
          description: "请检查图片地址是否正确",
          variant: "destructive",
        });
      };
      img.src = settings.wallpaperUrl;
    }
  }, [settings.wallpaperUrl, settings.backgroundType]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 overflow-hidden flex flex-col">
      {/* Top Header / Nav */}
      <header className="h-16 border-b border-orange-100/40 bg-white/60 backdrop-blur-2xl px-8 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md overflow-hidden bg-orange-500">
            <img src="favicon.png" className="w-full h-full object-contain" alt="logo" />
          </div>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Orange Snap
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/zhiyu1998/Orange-Snap"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-50"
            title="View on GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Left Toolbar (Perspective) */}
        <aside className="w-72 m-4 mr-0 rounded-[32px] border border-orange-100/30 bg-white/60 backdrop-blur-2xl shadow-2xl shadow-orange-900/5 flex flex-col shrink-0 z-20 overflow-hidden">
          <PerspectivePanel
            settings={settings}
            setSettings={setSettings}
            image={image}
          />
        </aside>

        {/* Center Canvas Area (Infinite Workspace) */}
        <section className="flex-1 relative overflow-auto p-12 flex items-center justify-center custom-scrollbar">
          <ImagePreview
            image={image}
            canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
            onImageSelect={setImage}
            triggerFileSelection={triggerFileSelection}
            settings={settings}
          />
        </section>

        {/* Right Inspector (Settings) */}
        <aside className="w-80 m-4 ml-0 rounded-[32px] border border-orange-100/30 bg-white/60 backdrop-blur-2xl shadow-2xl shadow-orange-900/5 flex flex-col shrink-0 z-20 overflow-y-auto custom-scrollbar overflow-hidden">
          <SettingsPanel
            settings={settings}
            setSettings={setSettings}
            setWallpaperImage={setWallpaperImage}
            defaultSettings={defaultSettings}
            image={image}
          />
        </aside>
      </main>

      {/* Hidden Canvas Renderer Logic */}
      <CanvasRenderer
        image={image}
        canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
        settings={settings}
        wallpaperImage={wallpaperImage}
      />
    </div>
  );
} 