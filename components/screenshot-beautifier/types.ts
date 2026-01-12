export interface ImageSettings {
    borderRadius: number
    padding: number
    backgroundColor: string
    backgroundType: "solid" | "gradient" | "pattern" | "wallpaper" | "mesh" | "paper-mesh" | "dot-orbit"
    gradientStart: string
    gradientEnd: string
    // Paper Shaders settings
    shaderDistortion: number
    shaderSwirl: number
    shaderSpeed: number
    shaderScale: number
    shaderColorBack: string
    scale: number
    browserStyle: "none" | "chrome" | "safari"
    shadow: number
    shadowColor: string
    wallpaperUrl: string
    meshColors: string[]
    meshSeed: number
    // Perspective settings
    rotateX: number
    rotateY: number
    rotateZ: number
    perspective: number
    tilt: number
}

export const defaultSettings: ImageSettings = {
    borderRadius: 24,
    padding: 140,
    backgroundColor: "#ffffff",
    backgroundType: "gradient",
    gradientStart: "#ff9a9e",
    gradientEnd: "#fecfef",
    shaderDistortion: 1,
    shaderSwirl: 0.8,
    shaderSpeed: 0.2,
    shaderScale: 1.0,
    shaderColorBack: "#000000",
    scale: 1.0,
    browserStyle: "safari",
    shadow: 30,
    shadowColor: "#00000030",
    wallpaperUrl: "",
    meshColors: [],
    meshSeed: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    perspective: 1000,
    tilt: 0,
}

export interface GradientPreset {
    name: string
    start: string
    end: string
}

export interface ColorPreset {
    name: string
    color: string
}

export interface PatternPreset {
    name: string
    pattern: string
    color: string
}

export interface WallpaperPreset {
    name: string
    url: string
    thumbnail: string
}

export interface PerspectivePreset {
    name: string
    rotateX: number
    rotateY: number
    rotateZ: number
    tilt: number
}

export const perspectivePresets: PerspectivePreset[] = [
    { name: "无", rotateX: 0, rotateY: 0, rotateZ: 0, tilt: 0 },
    { name: "左倾侧", rotateX: 10, rotateY: -20, rotateZ: 5, tilt: -15 },
    { name: "右倾侧", rotateX: 10, rotateY: 20, rotateZ: -5, tilt: 15 },
    { name: "俯视", rotateX: 25, rotateY: 0, rotateZ: 0, tilt: 0 },
    { name: "立体", rotateX: 15, rotateY: -15, rotateZ: 0, tilt: -10 },
    { name: "斜塔", rotateX: 5, rotateY: 5, rotateZ: 30, tilt: 0 },
    { name: "宽屏纵深", rotateX: 0, rotateY: -35, rotateZ: 0, tilt: -20 },
    { name: "书籍感", rotateX: 0, rotateY: 35, rotateZ: 0, tilt: 20 },
    { name: "极客风", rotateX: -20, rotateY: -20, rotateZ: 5, tilt: 0 },
    { name: "跃动", rotateX: 10, rotateY: 10, rotateZ: -15, tilt: 5 },
]

export const gradientPresets: GradientPreset[] = [
    { name: "蓝紫", start: "#667eea", end: "#764ba2" },
    { name: "粉橙", start: "#f093fb", end: "#f5576c" },
    { name: "绿蓝", start: "#4facfe", end: "#00f2fe" },
    { name: "紫粉", start: "#a8edea", end: "#fed6e3" },
    { name: "橙红", start: "#ff9a9e", end: "#fecfef" },
]

export const solidColorPresets: ColorPreset[] = [
    { name: "白色", color: "#FFFFFF" },
    { name: "浅灰 100", color: "#F3F4F6" },
    { name: "浅灰 200", color: "#E5E7EB" },
    { name: "浅灰 300", color: "#D1D5DB" },
    { name: "深灰 600", color: "#4B5563" },
    { name: "深灰 800", color: "#1F2937" },
    { name: "极致黑", color: "#000000" },
    { name: "珊瑚红", color: "#F87171" },
    { name: "活力橙", color: "#FB923C" },
    { name: "阳光金", color: "#FBBF24" },
    { name: "柠檬黄", color: "#FACC15" },
    { name: "青柠绿", color: "#A3E635" },
    { name: "翠绿色", color: "#4ADE80" },
    { name: "浅粉红", color: "#FDA4AF" },
    { name: "浅杏橙", color: "#FED7AA" },
    { name: "浅黄", color: "#FDE68A" },
    { name: "奶油黄", color: "#FEF08A" },
    { name: "薄荷绿", color: "#DCFCE7" },
    { name: "浅碧绿", color: "#D1FAE5" },
    { name: "蓝绿色", color: "#0D9488" },
    { name: "天蓝色", color: "#0EA5E9" },
    { name: "宝石蓝", color: "#2563EB" },
    { name: "靛蓝色", color: "#4F46E5" },
    { name: "罗兰紫", color: "#7C3AED" },
    { name: "玫瑰粉", color: "#EC4899" },
    { name: "浅青色", color: "#A5F3FC" },
    { name: "浅空蓝", color: "#BAE6FD" },
    { name: "浅天蓝", color: "#BFDBFE" },
    { name: "浅紫色", color: "#DDD6FE" },
    { name: "浅玫红", color: "#F5D0FE" },
    { name: "樱花粉", color: "#FCE7F3" },
]

export const patternPresets: PatternPreset[] = [
    { name: "心形", pattern: "hearts", color: "#a8d8f0" },
    { name: "圆点", pattern: "dots", color: "#ffd6cc" },
    { name: "条纹", pattern: "stripes", color: "#e8f5e8" },
    { name: "网格", pattern: "grid", color: "#f0e6ff" },
]

export const wallpaperPresets: WallpaperPreset[] = [
    {
        name: "Art1",
        url: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?q=80&w=2644&auto=format&fit=crop",
        thumbnail: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=700&auto=format&fit=crop&q=60",
    },
    {
        name: "Art2",
        url: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=2634&auto=format&fit=crop",
        thumbnail: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=700&auto=format&fit=crop&q=60",
    },
    {
        name: "Art3",
        url: "https://images.unsplash.com/photo-1579541591970-e5780dc6b31f?q=80&w=2686&auto=format&fit=crop",
        thumbnail: "https://images.unsplash.com/photo-1579541591970-e5780dc6b31f?w=700&auto=format&fit=crop&q=60",
    },
    {
        name: "Mac1",
        url: "https://images.unsplash.com/photo-1687042277586-971369d3d241?q=80&w=2670&auto=format&fit=crop",
        thumbnail: "https://images.unsplash.com/photo-1687042277586-971369d3d241?w=700&auto=format&fit=crop&q=60",
    },
    {
        name: "Mac2",
        url: "https://images.unsplash.com/photo-1687042277425-89b414406d3a?q=80&w=2670&auto=format&fit=crop",
        thumbnail: "https://images.unsplash.com/photo-1687042277425-89b414406d3a?w=700&auto=format&fit=crop&q=60",
    }
]