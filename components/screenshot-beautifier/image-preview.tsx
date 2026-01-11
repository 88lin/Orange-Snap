"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { snapdom } from "@zumer/snapdom";
import { Copy, Download, Upload } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { ImageSettings } from "./types";

interface ImagePreviewProps {
  image: HTMLImageElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement>; // Keep for compatibility but we'll use captureRef mostly
  onImageSelect: (img: HTMLImageElement | null) => void;
  triggerFileSelection: () => void;
  settings: ImageSettings;
}

export const ImagePreview = ({
  image,
  onImageSelect,
  triggerFileSelection,
  settings,
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
    [onImageSelect]
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

      toast({
        title: "图片已更新 ✨",
        description: "已重新选择图片进行美化",
      });
    }
  };

  const downloadImage = async () => {
    if (!captureRef.current) return;
    setIsExporting(true);
    
    try {
      await snapdom.download(captureRef.current, {
        scale: 2, // High resolution
        filename: "beautified-screenshot",
        type: "png"
      });

      toast({
        title: "下载成功 🎉",
        description: "美化后的截图已保存",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "下载失败",
        description: "请重试或检查图片是否跨域",
        variant: "destructive"
      });
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
        type: "png"
      });

      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

      toast({
        title: "复制成功 📋",
        description: "图片已复制到剪切板",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "复制失败",
        description: "暂时无法复制到剪切板",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Helper for background style
  const backgroundStyle = useMemo(() => {
    if (settings.backgroundType === "gradient") {
      return { background: `linear-gradient(45deg, ${settings.gradientStart}, ${settings.gradientEnd})` };
    }
    if (settings.backgroundType === "wallpaper" && settings.wallpaperUrl) {
      return { 
        backgroundImage: `url(${settings.wallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return { backgroundColor: settings.backgroundColor };
  }, [settings]);

  return (
    <>
      {!image ? (
        <div
          className={`relative group w-full max-w-2xl border-2 border-dashed rounded-3xl transition-all duration-500 overflow-hidden ${
            isDragging
              ? "border-orange-500 bg-orange-50/50 scale-[1.02]"
              : "border-gray-200 bg-white/50 hover:border-orange-300 hover:bg-white/80"
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-12">
            <div className="w-20 h-20 bg-orange-100/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-500">
              <Upload className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">开启您的创作</h3>
            <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto leading-relaxed">
              将截图拖拽到此处，或点击按钮开始一段美妙的视觉之旅
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-2xl shadow-lg shadow-orange-500/20"
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
        <div className="relative group w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
          
          {/* SnapDOM Export Root (Responsive & Realistic) */}
          <div
            ref={captureRef}
            className="rounded-[48px] overflow-hidden flex items-center justify-center relative transition-all duration-500"
            style={{
              padding: `${settings.padding}px`,
              transition: 'padding 0.5s ease',
              width: 'max-content',
              minWidth: '400px',
              ...backgroundStyle
            }}
          >
            {/* 3D Transform Group (Image + Frame + Shadow) */}
            <div
              className="relative transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                perspective: `${settings.perspective}px`,
                transformStyle: 'preserve-3d',
                transform: `rotateX(${settings.rotateX}deg) rotateY(${settings.rotateY}deg) rotateZ(${settings.rotateZ}deg) skew(${settings.tilt}deg, 0deg)`,
              }}
            >
              {/* Browser Frame */}
              <div 
                className="relative overflow-hidden shadow-2xl flex flex-col"
                style={{
                  borderRadius: `${settings.borderRadius}px`,
                  boxShadow: `0 ${settings.shadow}px ${settings.shadow * 2}px ${settings.shadowColor}`,
                  transform: `scale(${settings.scale})`,
                  transition: 'all 0.5s ease'
                }}
              >
                {/* Browser Bar */}
                {settings.browserStyle !== "none" && (
                  <div 
                    className={`h-10 px-4 flex items-center gap-2 ${settings.browserStyle === 'safari' ? 'bg-[#f6f6f6]' : 'bg-[#e8eaed]'} border-b border-black/5`}
                  >
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
                    </div>
                    {/* Optional Address Bar */}
                    <div className="flex-1 max-w-sm mx-auto h-6 bg-white/50 rounded-md border border-black/5" />
                  </div>
                )}
                
                {/* Main Image */}
                <img 
                  src={image.src} 
                  alt="screenshot"
                  className="block select-none"
                  style={{ 
                    maxWidth: '800px', // Large base size for desktop-feel
                    maxHeight: '70vh',
                    width: 'auto',
                    height: 'auto'
                  }}
                  onClick={triggerFileSelection}
                />
                
                {/* Overlay Hint on Hover */}
                <div 
                  className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group/hint cursor-pointer"
                  onClick={triggerFileSelection}
                >
                  <Upload className="text-white opacity-0 group-hover/hint:opacity-100 transition-opacity w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Control Bar */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-2 flex items-center gap-2 ring-1 ring-black/5">
              <Button
                variant="ghost"
                size="lg"
                onClick={copyToClipboard}
                disabled={isExporting}
                className="hover:bg-orange-50 hover:text-orange-600 text-gray-600 font-medium px-6 h-12 rounded-full flex items-center gap-2 transition-all active:scale-95"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                <span>复制图片</span>
              </Button>
              
              <div className="w-[1px] h-6 bg-gray-100 mx-1" />

              <Button
                variant="default"
                size="lg"
                onClick={downloadImage}
                disabled={isExporting}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 h-12 rounded-full shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-95"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>下载图集</span>
              </Button>

              <div className="w-[1px] h-6 bg-gray-100 mx-1" />

              <Button
                variant="ghost"
                size="icon"
                onClick={triggerFileSelection}
                className="h-12 w-12 rounded-full text-gray-400 hover:text-orange-500 hover:bg-orange-50"
              >
                <Upload className="w-4 h-4" />
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
      xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}