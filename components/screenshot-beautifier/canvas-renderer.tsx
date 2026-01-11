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
  const renderCanvas = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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

    // 计算图片位置
    const imageX = settings.padding;
    const imageY = settings.padding + chromeHeight;

    // --- 应用 3D 变换 (对阴影、Chrome 和图片整体应用) ---
    ctx.save();
    
    // 计算中心点用于旋转
    const centerX = imageX + scaledWidth / 2;
    const centerY = imageY + (scaledHeight + chromeHeight) / 2 - chromeHeight / 2;
    ctx.translate(centerX, centerY);
    
    // 模拟倾斜 (Skew)
    if (settings.tilt !== 0) {
      ctx.transform(1, 0, Math.tan(settings.tilt * Math.PI / 180), 1, 0, 0);
    }
    
    // 应用 Z 轴旋转
    if (settings.rotateZ !== 0) {
      ctx.rotate(settings.rotateZ * Math.PI / 180);
    }

    // 模拟 X/Y 旋转产生的缩放
    const scaleX = Math.cos(settings.rotateY * Math.PI / 180);
    const scaleY = Math.cos(settings.rotateX * Math.PI / 180);
    ctx.scale(scaleX, scaleY);
    
    // 移回原点
    ctx.translate(-centerX, -centerY);

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
        ctx.roundRect(imageX, imageY, scaledWidth, scaledHeight, Math.max(settings.borderRadius, 24));
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
    renderCanvas();
  }, [renderCanvas]);

  return null;
}; 