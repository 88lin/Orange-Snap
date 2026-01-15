"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageSettings } from "../types";

interface BackgroundSelectorProps {
  value: ImageSettings["backgroundType"];
  onValueChange: (value: ImageSettings["backgroundType"]) => void;
}

export const BackgroundSelector = ({ value, onValueChange }: BackgroundSelectorProps) => {
  return (
    <section className="sticky top-0 z-20 -mx-6 space-y-3 border-b border-orange-100/10 bg-white/95 px-6 pb-4 pt-6 backdrop-blur-xl">
      <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        画布背景
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-10 w-full border-gray-100 bg-gray-50/50 text-sm">
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
            <SelectItem value="static-mesh">静态弥散 (Static Mesh 🎨)</SelectItem>
            <SelectItem value="dot-orbit">灵动圆点 (Dot Orbit 🪐)</SelectItem>
            <SelectItem value="noise">噪声艺术 (Simplex Noise 🎨)</SelectItem>
            <SelectItem value="voronoi">泰森多边形 (Voronoi 💎)</SelectItem>
            <SelectItem value="grain-gradient">颗粒渐变 (Grain Gradient 🌊)</SelectItem>
            <SelectItem value="warp">扭曲艺术 (Warp 🌊✨)</SelectItem>
            <SelectItem value="smoke-ring">烟雾环 (Smoke Ring 💨)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="text-[10px] text-gray-400">装饰背景 (Decorative)</SelectLabel>
            <SelectItem value="pattern">艺术图案 (Pattern)</SelectItem>
            <SelectItem value="wallpaper">精美壁纸 (Wallpaper)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
  );
};
