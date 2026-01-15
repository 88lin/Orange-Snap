"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageSettings } from "../types";

interface BrowserStyleSectionProps {
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
}

export const BrowserStyleSection = ({ settings, setSettings }: BrowserStyleSectionProps) => {
  return (
    <section className="space-y-3 border-t border-gray-50 pb-8 pt-6">
      <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        外观装饰
      </Label>
      <Select
        value={settings.browserStyle}
        onValueChange={(value: "none" | "chrome" | "safari") =>
          setSettings((prev) => ({ ...prev, browserStyle: value }))
        }
      >
        <SelectTrigger className="h-10 w-full border-gray-100 bg-gray-50/50 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">无窗口装饰 (None)</SelectItem>
          <SelectItem value="chrome">Chrome 浏览器</SelectItem>
          <SelectItem value="safari">Safari 浏览器</SelectItem>
        </SelectContent>
      </Select>
    </section>
  );
};
