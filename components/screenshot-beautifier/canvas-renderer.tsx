"use client";

import { useCallback, useEffect } from "react";
import { drawBrowserChrome, drawPattern } from "./canvas-utils";
import { ImageSettings, patternPresets } from "./types";

interface CanvasRendererProps {
  image: HTMLImageElement | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  settings: ImageSettings;
  wallpaperImage: HTMLImageElement | null;
}

export const CanvasRenderer = ({ image, canvasRef, settings, wallpaperImage }: CanvasRendererProps) => {
  const renderCanvas = useCallback((isExport = false) => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // 计算图片缩放后的尺寸
    const scaledWidth = image.width * settings.scale;
    const scaledHeight = image.height * settings.scale;

    // 计算浏览器chrome高度
    const chromeHeight = settings.browserStyle !== "none" ? 60 : 0;

    // 计算最终画布尺寸
    const canvasWidth = scaledWidth + settings.padding * 2;
    const canvasHeight = scaledHeight + chromeHeight + settings.padding * 2;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // --- 绘制大圆角背景外框 ---
    // 在预览模式下，背景完全透明（由 CSS 设置），仅在导出模式下绘制背景
    if (isExport) {
        const OUTER_RADIUS = 48; // 固定的大圆角
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(0, 0, canvasWidth, canvasHeight, OUTER_RADIUS);
        ctx.clip();

        // 绘制背景内容
        if (settings.backgroundType === "solid") {
          ctx.fillStyle = settings.backgroundColor;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        } else if (settings.backgroundType === "gradient") {
          const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
          gradient.addColorStop(0, settings.gradientStart);
          gradient.addColorStop(1, settings.gradientEnd);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        } else if (settings.backgroundType === "pattern") {
          const selectedPattern = patternPresets.find((p) => p.color === settings.backgroundColor);
          if (selectedPattern) {
            drawPattern(ctx, canvasWidth, canvasHeight, selectedPattern.pattern, selectedPattern.color);
          }
        } else if (settings.backgroundType === "wallpaper" && wallpaperImage) {
          // 绘制壁纸背景
          const scale = Math.max(canvasWidth / wallpaperImage.width, canvasHeight / wallpaperImage.height);
          const scaledWallpaperWidth = wallpaperImage.width * scale;
          const scaledWallpaperHeight = wallpaperImage.height * scale;
          const offsetX = (canvasWidth - scaledWallpaperWidth) / 2;
          const offsetY = (canvasHeight - scaledWallpaperHeight) / 2;

          ctx.drawImage(wallpaperImage, offsetX, offsetY, scaledWallpaperWidth, scaledWallpaperHeight);
        }
        
        ctx.restore();
    }

    // 计算图片位置
    const imageX = settings.padding;
    const imageY = settings.padding + chromeHeight;

    // --- 应用 3D 变换 ---
    // 如果是导出(下载)，应用 2D 模拟 3D。如果是 UI 预览，由外部 CSS 处理。
    ctx.save();
    
    if (isExport) {
        const centerX = imageX + scaledWidth / 2;
        const centerY = imageY + (scaledHeight + chromeHeight) / 2 - chromeHeight / 2;
        ctx.translate(centerX, centerY);
        
        if (settings.tilt !== 0 || settings.rotateY !== 0 || settings.rotateX !== 0) {
          const shearX = Math.tan(settings.rotateY * -0.5 * Math.PI / 180) + Math.tan(settings.tilt * Math.PI / 180);
          const shearY = Math.tan(settings.rotateX * 0.5 * Math.PI / 180);
          ctx.transform(1, shearY, shearX, 1, 0, 0);
        }
        
        if (settings.rotateZ !== 0) {
          ctx.rotate(settings.rotateZ * Math.PI / 180);
        }
        
        ctx.translate(-centerX, -centerY);
    }

    // 绘制阴影
    if (settings.shadow > 0) {
      ctx.save();
      ctx.shadowColor = settings.shadowColor;
      ctx.shadowBlur = settings.shadow;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = settings.shadow / 4;

      ctx.fillStyle = "#000000";
      ctx.beginPath();
      if (settings.browserStyle !== "none") {
        ctx.roundRect(imageX, imageY - chromeHeight, scaledWidth, scaledHeight + chromeHeight, [
          settings.borderRadius,
          settings.borderRadius,
          settings.borderRadius,
          settings.borderRadius,
        ]);
      } else {
        ctx.roundRect(imageX, imageY, scaledWidth, scaledHeight, settings.borderRadius);
      }
      ctx.fill();
      ctx.restore();
    }

    // 绘制浏览器chrome
    if (settings.browserStyle !== "none") {
      drawBrowserChrome(
        ctx,
        imageX,
        imageY - chromeHeight,
        scaledWidth,
        scaledHeight + chromeHeight,
        settings.browserStyle,
        settings.borderRadius
      );
    }

    // 绘制图片
    ctx.save();
    ctx.beginPath();
    if (settings.browserStyle !== "none") {
      ctx.roundRect(imageX, imageY, scaledWidth, scaledHeight, [0, 0, settings.borderRadius, settings.borderRadius]);
    } else {
      ctx.roundRect(imageX, imageY, scaledWidth, scaledHeight, settings.borderRadius);
    }
    ctx.clip();
    ctx.drawImage(image, imageX, imageY, scaledWidth, scaledHeight);
    ctx.restore();
    
    // 结束 3D 变换
    ctx.restore();
  }, [image, settings, wallpaperImage]);

  useEffect(() => {
    // 默认执行普通预览渲染
    renderCanvas(false);
  }, [renderCanvas]);

  // 暴露导出方法给外部
  useEffect(() => {
    if (canvasRef.current) {
        (canvasRef.current as any).exportImage = () => {
            renderCanvas(true);
            const dataUrl = canvasRef.current!.toDataURL('image/png');
            renderCanvas(false); // 切回预览模式
            return dataUrl;
        }
    }
  }, [renderCanvas, canvasRef]);

  return null;
};