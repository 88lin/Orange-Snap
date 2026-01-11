"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Copy, Download, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface ImagePreviewProps {
  image: HTMLImageElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onImageSelect: (img: HTMLImageElement | null) => void;
  triggerFileSelection: () => void;
}

export const ImagePreview = ({
  image,
  canvasRef,
  onImageSelect,
  triggerFileSelection,
}: ImagePreviewProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      // Reset the file input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "图片已更新 ✨",
        description: "已重新选择图片进行美化",
      });
    }
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = "beautified-screenshot.png";
    link.href = canvasRef.current.toDataURL();
    link.click();

    toast({
      title: "下载成功 🎉",
      description: "美化后的截图已保存",
    });
  };

  const copyToClipboard = async () => {
    if (!canvasRef.current) return;

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current!.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("无法创建图片Blob"));
          }
        }, "image/png");
      });

      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);

      // 显示成功通知
      toast({
        title: "复制成功 📋",
        description: "图片已复制到剪切板，可以直接粘贴使用",
        variant: "default",
        duration: 2000,
      });

      // 添加视觉反馈
      const copyButton = document.querySelector('[data-copy-button="true"]');
      if (copyButton) {
        copyButton.classList.add('bg-green-100');
        setTimeout(() => {
          copyButton.classList.remove('bg-green-100');
        }, 1000);
      }
    } catch (error) {
      console.error("复制失败:", error);

      toast({
        title: "复制失败",
        description: "请尝试使用下载功能",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

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
              将截图拖拽到此处，或点击按钮从本地上传，开始一段美妙的视觉之旅
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
            >
              选择本地图片
            </Button>
            <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-300">
              <span className="px-1.5 py-0.5 border border-gray-100 rounded">Ctrl</span> + <span className="px-1.5 py-0.5 border border-gray-100 rounded">V</span> 快速粘贴
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              key="file-input"
            />
          </div>
        </div>
      ) : (
        <div className="relative group w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
          {/* Canvas Container */}
          <div
            className="relative p-8 mb-24 transition-transform duration-500 hover:scale-[1.01] cursor-pointer group/canvas"
            onClick={triggerFileSelection}
            title="点击更换图片"
          >
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto drop-shadow-2xl transition-all duration-500 group-hover/canvas:brightness-[0.98]"
              style={{ maxHeight: "80vh" }}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-xl shadow-black/5 scale-90 group-hover/canvas:scale-100 transition-transform duration-500">
                <Upload className="w-4 h-4 text-white drop-shadow-sm" />
                <span className="text-xs font-bold text-white drop-shadow-sm uppercase tracking-wider">更换图片</span>
              </div>
            </div>
          </div>

          {/* Floating Control Bar */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-2 flex items-center gap-2 ring-1 ring-black/5 animate-in slide-in-from-bottom-10 duration-700">
              <Button
                variant="ghost"
                size="lg"
                onClick={copyToClipboard}
                className="hover:bg-orange-50 hover:text-orange-600 text-gray-600 font-medium px-6 h-12 rounded-2xl flex items-center gap-2 transition-all active:scale-95"
                data-copy-button="true"
              >
                <Copy className="w-4 h-4" />
                <span>复制图片</span>
              </Button>
              
              <div className="w-[1px] h-6 bg-gray-100 mx-1" />

              <Button
                variant="default"
                size="lg"
                onClick={downloadImage}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 h-12 rounded-2xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>下载截图</span>
              </Button>

              <div className="w-[1px] h-6 bg-gray-100 mx-1" />

              <Button
                variant="ghost"
                size="icon"
                onClick={triggerFileSelection}
                className="h-12 w-12 rounded-2xl text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all active:scale-95"
                title="重新选择"
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