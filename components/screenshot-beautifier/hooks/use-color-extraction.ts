"use client";

import { useState } from "react";
import { ColorExtractionService } from "@/lib/color-extraction-service";
import { ImageSettings } from "../types";

export interface UseColorExtractionProps {
  image: HTMLImageElement | null;
  settings: ImageSettings;
  setSettings: React.Dispatch<React.SetStateAction<ImageSettings>>;
  aiColors: string[];
  setAiColors: (colors: string[]) => void;
  setAiGradients: (gradients: Array<{ start: string; end: string }>) => void;
}

export const useColorExtraction = ({
  image,
  settings,
  setSettings,
  aiColors,
  setAiColors,
  setAiGradients,
}: UseColorExtractionProps) => {
  const [isExtracting, setIsExtracting] = useState(false);

  const shuffleColors = () => {
    if (aiColors.length < 2) return;
    const shuffled = [...aiColors];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setAiColors(shuffled);

    if (settings.backgroundType === "mesh") {
      setSettings((p) => ({ ...p, meshColors: shuffled.slice(0, 5) }));
    }
  };

  const extractAllFromImage = async () => {
    if (!image) return;

    setIsExtracting(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(image, 0, 0);

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.9),
      );

      const file = new File([blob], "image.jpg", { type: "image/jpeg" });

      const service = new ColorExtractionService();
      const { colors, gradients } = await service.extractAll(file);

      setAiColors(colors);
      setAiGradients(gradients);
    } catch (error: any) {
      console.error("Error extracting AI data:", error);
    } finally {
      setIsExtracting(false);
    }
  };

  return {
    isExtracting,
    shuffleColors,
    extractAllFromImage,
  };
};
