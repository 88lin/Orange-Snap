"use client";

import { Github } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ColorExtractionService } from "@/lib/color-extraction-service";
import { ImagePreview } from "./image-preview";
import { PerspectivePanel } from "./perspective-panel";
import { SettingsPanel } from "./settings-panel";
import { defaultSettings, ImageSettings } from "./types";

export function ScreenshotBeautifier() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<ImageSettings>(defaultSettings);
  const [aiColors, setAiColors] = useState<string[]>([]);
  const [aiGradients, setAiGradients] = useState<Array<{ start: string; end: string }>>([]);
  const [isAutoExtracting, setIsAutoExtracting] = useState(false);
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
        }
        break;
      }
    }
  }, []);

  // 触发文件选择
  const triggerFileSelection = useCallback(() => {
    // 创建一个新的文件输入元素动态确保它可以正常工作
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = URL.createObjectURL(file);
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

  // Handle auto-AI extraction on image change
  useEffect(() => {
    const autoExtract = async () => {
      if (!image) return;
      setIsAutoExtracting(true);

      const service = new ColorExtractionService();

      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0);

        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.8),
        );
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });

        const { colors, gradients } = await service.extractAll(file);

        setAiColors(colors);
        setAiGradients(gradients);

        // Auto-populate backgrounds if they are matching defaults or empty
        setSettings((prev) => ({
          ...prev,
          backgroundColor: colors[0] || prev.backgroundColor,
          gradientStart: gradients[0]?.start || prev.gradientStart,
          gradientEnd: gradients[0]?.end || prev.gradientEnd,
          meshColors: colors.slice(0, 5),
        }));
      } catch (err) {
        console.warn("Auto-extraction failed (Key might be missing):", err);
      } finally {
        setIsAutoExtracting(false);
      }
    };

    autoExtract();
  }, [image]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
      {/* Top Header / Nav */}
      <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-orange-100/40 bg-white/60 px-8 backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 overflow-hidden rounded-md bg-orange-500">
            <img src="favicon.png" className="h-full w-full object-contain" alt="logo" />
          </div>
          <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-semibold text-transparent">
            Orange Snap
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/zhiyu1998/Orange-Snap"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
            title="View on GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="relative flex flex-1 overflow-hidden">
        {/* Left Toolbar (Perspective) */}
        <aside className="z-20 m-4 mr-0 flex w-72 shrink-0 flex-col overflow-hidden rounded-[32px] border border-orange-100/30 bg-white/60 shadow-2xl shadow-orange-900/5 backdrop-blur-2xl">
          <PerspectivePanel settings={settings} setSettings={setSettings} image={image} />
        </aside>

        {/* Center Canvas Area (Infinite Workspace) */}
        <section className="custom-scrollbar relative flex flex-1 items-center justify-center overflow-auto p-12">
          <ImagePreview
            image={image}
            canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
            onImageSelect={setImage}
            triggerFileSelection={triggerFileSelection}
            settings={settings}
            aiColors={aiColors}
          />
        </section>

        {/* Right Inspector (Settings) */}
        <aside className="custom-scrollbar z-20 m-4 ml-0 flex w-80 shrink-0 flex-col overflow-hidden overflow-y-auto rounded-[32px] border border-orange-100/30 bg-white/60 shadow-2xl shadow-orange-900/5 backdrop-blur-2xl">
          <SettingsPanel
            settings={settings}
            setSettings={setSettings}
            defaultSettings={defaultSettings}
            image={image}
            aiColors={aiColors}
            setAiColors={setAiColors}
            aiGradients={aiGradients}
            setAiGradients={setAiGradients}
            isAutoExtracting={isAutoExtracting}
          />
        </aside>
      </main>
    </div>
  );
}
