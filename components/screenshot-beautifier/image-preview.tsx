"use client";

import { Button } from "@/components/ui/button";
import { snapdom } from "@zumer/snapdom";
import { Copy, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageSettings } from "./types";
import { MeshBackground } from "./mesh-background";
import { PaperBackground } from "./paper-background";

interface ImagePreviewProps {
  image: HTMLImageElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement>; // Keep for compatibility but we'll use captureRef mostly
  onImageSelect: (img: HTMLImageElement | null) => void;
  triggerFileSelection: () => void;
  settings: ImageSettings;
  aiColors: string[];
}

export const ImagePreview = ({
  image,
  onImageSelect,
  triggerFileSelection,
  settings,
  aiColors,
}: ImagePreviewProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => onImageSelect(img);
        img.src = URL.createObjectURL(files[0]);
      }
    },
    [onImageSelect],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => onImageSelect(img);
      img.src = URL.createObjectURL(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const downloadImage = async () => {
    if (!captureRef.current) return;
    setIsExporting(true);

    try {
      await snapdom.download(captureRef.current, {
        scale: 2, // High resolution
        filename: "beautified-screenshot",
        type: "png",
      });
      toast.success("下载成功 🎉");
    } catch (err) {
      console.error(err);
      toast.error("下载失败，请重试");
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!captureRef.current) return;
    setIsExporting(true);

    try {
      const blob = await snapdom.toBlob(captureRef.current, {
        scale: 2,
        type: "png",
      });

      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("图片已成功复制到剪切板 📋");
    } catch (error) {
      console.error(error);
      toast.error("复制失败，请尝试直接下载");
    } finally {
      setIsExporting(false);
    }
  };

  // Keyboard listener for Ctrl+C
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        if (image && !isExporting) {
          copyToClipboard();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, isExporting, copyToClipboard]);

  // Helper for background style
  const backgroundStyle = useMemo(() => {
    if (settings.backgroundType === "gradient") {
      return {
        background: `linear-gradient(45deg, ${settings.gradientStart}, ${settings.gradientEnd})`,
      };
    }
    if (settings.backgroundType === "wallpaper" && settings.wallpaperUrl) {
      return {
        backgroundImage: `url(${settings.wallpaperUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return { backgroundColor: settings.backgroundColor };
  }, [settings]);

  return (
    <>
      {!image ? (
        <div
          className={`group relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-500 ${
            isDragging
              ? "scale-[1.02] border-orange-500 bg-orange-50/50"
              : "border-gray-200 bg-white/50 hover:border-orange-300 hover:bg-white/80"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <div className="flex min-h-[400px] flex-col items-center justify-center p-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100/50 transition-all duration-500 group-hover:scale-110 group-hover:bg-orange-100">
              <Upload className="h-10 w-10 text-orange-500" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">开启您的创作</h3>
            <p className="mx-auto mb-8 max-w-xs text-sm leading-relaxed text-gray-400">
              将截图拖拽到此处，或点击按钮开始一段美妙的视觉之旅
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl bg-orange-500 px-8 py-6 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
            >
              选择本地图片
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="group relative flex h-full w-full flex-col items-center justify-center duration-500 animate-in fade-in zoom-in-95">
          {/* SnapDOM Export Root (Responsive & Realistic) */}
          <div
            ref={captureRef}
            className="relative flex items-center justify-center overflow-hidden rounded-[48px] transition-all duration-500"
            style={{
              padding: `${settings.padding}px`,
              transition: "padding 0.5s ease",
              width: "max-content",
              minWidth: "400px",
              ...(settings.backgroundType !== "mesh" ? backgroundStyle : {}),
            }}
          >
            {settings.backgroundType === "mesh" && (
              <MeshBackground
                primaryColor={settings.backgroundColor}
                additionalColors={settings.meshColors}
                seed={settings.meshSeed}
              />
            )}
            {(settings.backgroundType === "paper-mesh" ||
              settings.backgroundType === "dot-orbit" ||
              settings.backgroundType === "noise" ||
              settings.backgroundType === "voronoi" ||
              settings.backgroundType === "grain-gradient" ||
              settings.backgroundType === "warp" ||
              settings.backgroundType === "static-mesh" ||
              settings.backgroundType === "smoke-ring") && (
              <PaperBackground settings={settings} aiColors={aiColors} />
            )}
            {/* 3D Transform Group (Image + Frame + Shadow) */}
            <div
              className="relative transition-all duration-700"
              style={{
                transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                perspective: `${settings.perspective}px`,
                transformStyle: "preserve-3d",
                transform: `rotateX(${settings.rotateX}deg) rotateY(${settings.rotateY}deg) rotateZ(${settings.rotateZ}deg) skew(${settings.tilt}deg, 0deg)`,
              }}
            >
              {/* Browser Frame */}
              <div
                className="relative flex flex-col overflow-hidden shadow-2xl"
                style={{
                  borderRadius: `${settings.borderRadius}px`,
                  boxShadow: `0 ${settings.shadow}px ${settings.shadow * 2}px ${settings.shadowColor}`,
                  transform: `scale(${settings.scale})`,
                  transition: "all 0.5s ease",
                }}
              >
                {/* Browser Bar */}
                {settings.browserStyle !== "none" && (
                  <div
                    className={`flex h-10 items-center gap-2 px-4 ${settings.browserStyle === "safari" ? "bg-[#f6f6f6]" : "bg-[#e8eaed]"} border-b border-black/5`}
                  >
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                      <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                      <div className="h-3 w-3 rounded-full bg-[#28ca42]" />
                    </div>
                    {/* Optional Address Bar */}
                    <div className="mx-auto h-6 max-w-sm flex-1 rounded-md border border-black/5 bg-white/50" />
                  </div>
                )}

                {/* Main Image */}
                <img
                  src={image.src}
                  alt="screenshot"
                  className="block select-none"
                  style={{
                    maxWidth: "800px", // Large base size for desktop-feel
                    maxHeight: "70vh",
                    width: "auto",
                    height: "auto",
                  }}
                  onClick={triggerFileSelection}
                />

                {/* Overlay Hint on Hover */}
                <div
                  className="group/hint absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 transition-colors hover:bg-black/10"
                  onClick={triggerFileSelection}
                >
                  <Upload className="h-8 w-8 text-white opacity-0 transition-opacity group-hover/hint:opacity-100" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Control Bar */}
          <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-3xl border border-white/20 bg-white/80 p-2 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl">
              <Button
                variant="ghost"
                size="lg"
                onClick={copyToClipboard}
                disabled={isExporting}
                className="flex h-12 items-center gap-2 rounded-full px-6 font-medium text-gray-600 transition-all hover:bg-orange-50 hover:text-orange-600 active:scale-95"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>复制图片</span>
              </Button>

              <div className="mx-1 h-6 w-[1px] bg-gray-100" />

              <Button
                variant="default"
                size="lg"
                onClick={downloadImage}
                disabled={isExporting}
                className="flex h-12 items-center gap-2 rounded-full bg-orange-500 px-8 font-medium text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>下载图集</span>
              </Button>

              <div className="mx-1 h-6 w-[1px] bg-gray-100" />

              <Button
                variant="ghost"
                size="icon"
                onClick={triggerFileSelection}
                className="h-12 w-12 rounded-full text-gray-400 hover:bg-orange-50 hover:text-orange-500"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Simple Loader icon
function Loader2({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
