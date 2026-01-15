import { ImageSettings } from "../types";

export interface SliderConfig {
  label: string;
  key: keyof ImageSettings;
  min: number;
  max: number;
  step: number;
  format?: (value: number) => string;
}

// Common slider configs shared across multiple shaders
export const commonSliders = {
  speed: {
    label: "速度",
    key: "shaderSpeed" as keyof ImageSettings,
    min: 0,
    max: 1,
    step: 0.01,
    format: (v: number) => v.toFixed(2),
  },
  scale: {
    label: "比例",
    key: "shaderScale" as keyof ImageSettings,
    min: 0.1,
    max: 4,
    step: 0.1,
    format: (v: number) => v.toFixed(1),
  },
  distortion: {
    label: "扭曲",
    key: "shaderDistortion" as keyof ImageSettings,
    min: 0,
    max: 2,
    step: 0.1,
    format: (v: number) => v.toFixed(1),
  },
  swirl: {
    label: "旋涡",
    key: "shaderSwirl" as keyof ImageSettings,
    min: 0,
    max: 2,
    step: 0.1,
    format: (v: number) => v.toFixed(1),
  },
  grainMixer: {
    label: "颗粒混合",
    key: "grainMixer" as keyof ImageSettings,
    min: 0,
    max: 1,
    step: 0.01,
    format: (v: number) => v.toFixed(2),
  },
  grainOverlay: {
    label: "颗粒叠加",
    key: "grainOverlay" as keyof ImageSettings,
    min: 0,
    max: 1,
    step: 0.01,
    format: (v: number) => v.toFixed(2),
  },
} satisfies Record<string, SliderConfig>;

// Smoke Ring specific sliders
export const smokeRingSliders: SliderConfig[] = [
  {
    label: "噪声频率",
    key: "smokeNoiseScale",
    min: 0.01,
    max: 5,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "噪声细节",
    key: "smokeNoiseIterations",
    min: 1,
    max: 8,
    step: 1,
    format: (v) => v.toString(),
  },
  {
    label: "半径",
    key: "smokeRadius",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "厚度",
    key: "smokeThickness",
    min: 0.01,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "内部填充",
    key: "smokeInnerShape",
    min: 0,
    max: 4,
    step: 0.1,
    format: (v) => v.toFixed(2),
  },
];

// Static Mesh specific sliders
export const staticMeshSliders: SliderConfig[] = [
  {
    label: "位置",
    key: "meshPositions",
    min: 0,
    max: 100,
    step: 1,
    format: (v) => v.toString(),
  },
  {
    label: "波形 X",
    key: "meshWaveX",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "波形 X 偏移",
    key: "meshWaveXShift",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "波形 Y",
    key: "meshWaveY",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "波形 Y 偏移",
    key: "meshWaveYShift",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "混合",
    key: "meshMixing",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "旋转",
    key: "meshRotation",
    min: 0,
    max: 360,
    step: 1,
    format: (v) => v.toString(),
  },
];

// Warp specific sliders
export const warpSliders: SliderConfig[] = [
  {
    label: "混合比例",
    key: "warpProportion",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "柔化",
    key: "warpSoftness",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "旋涡迭代",
    key: "warpSwirlIterations",
    min: 0,
    max: 20,
    step: 1,
    format: (v) => v.toString(),
  },
  {
    label: "形状比例",
    key: "warpShapeScale",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
];

// Noise specific sliders
export const noiseSliders: SliderConfig[] = [
  {
    label: "步数",
    key: "noiseSteps",
    min: 1,
    max: 5,
    step: 1,
    format: (v) => v.toString(),
  },
  {
    label: "柔化",
    key: "noiseSoftness",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
];

// Voronoi specific sliders
export const voronoiSliders: SliderConfig[] = [
  {
    label: "步数",
    key: "voronoiSteps",
    min: 1,
    max: 10,
    step: 1,
    format: (v) => v.toString(),
  },
  {
    label: "扭曲",
    key: "voronoiDistortion",
    min: 0,
    max: 2,
    step: 0.1,
    format: (v) => v.toFixed(2),
  },
  {
    label: "间隙",
    key: "voronoiGap",
    min: 0,
    max: 0.5,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "发光",
    key: "voronoiGlow",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
];

// Grain Gradient specific sliders
export const grainGradientSliders: SliderConfig[] = [
  {
    label: "柔化",
    key: "grainSoftness",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "强度",
    key: "grainIntensity",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
  {
    label: "噪点",
    key: "grainNoise",
    min: 0,
    max: 1,
    step: 0.01,
    format: (v) => v.toFixed(2),
  },
];

// Select options
export const warpShapeOptions = [
  { value: "checks", label: "Checks" },
  { value: "stripes", label: "Stripes" },
  { value: "edge", label: "Edge" },
];

export const grainShapeOptions = [
  { value: "wave", label: "Wave" },
  { value: "dots", label: "Dots" },
  { value: "truchet", label: "Truchet" },
  { value: "corners", label: "Corners" },
  { value: "ripple", label: "Ripple" },
  { value: "blob", label: "Blob" },
  { value: "sphere", label: "Sphere" },
];

// Background types that use Paper shaders (need advanced controls header)
export const paperShaderTypes = [
  "paper-mesh",
  "dot-orbit",
  "noise",
  "voronoi",
  "grain-gradient",
  "warp",
  "static-mesh",
  "smoke-ring",
] as const;

// Background types that need speed control (all except static-mesh)
export const speedControlTypes = paperShaderTypes.filter((t) => t !== "static-mesh");

// Background types that need scale control
export const scaleControlTypes = [
  "dot-orbit",
  "noise",
  "voronoi",
  "grain-gradient",
  "warp",
  "static-mesh",
  "smoke-ring",
] as const;

// Background types that need background color control
export const backgroundColorTypes = ["dot-orbit", "grain-gradient", "smoke-ring"] as const;
