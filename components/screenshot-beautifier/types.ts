export interface ImageSettings {
    borderRadius: number
    padding: number
    backgroundColor: string
    backgroundType: "solid" | "gradient" | "pattern" | "wallpaper"
    gradientStart: string
    gradientEnd: string
    scale: number
    browserStyle: "none" | "chrome" | "safari"
    shadow: number
    shadowColor: string
    wallpaperUrl: string
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
    backgroundColor: "#f0f0f0",
    backgroundType: "solid",
    gradientStart: "#667eea",
    gradientEnd: "#764ba2",
    scale: 1.4,
    browserStyle: "none",
    shadow: 20,
    shadowColor: "#00000060",
    wallpaperUrl: "",
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
    { name: "浅灰", color: "#f8f9fa" },
    { name: "深灰", color: "#343a40" },
    { name: "蓝色", color: "#007bff" },
    { name: "绿色", color: "#28a745" },
    { name: "紫色", color: "#6f42c1" },
    { name: "粉色", color: "#e83e8c" },
    { name: "橙色", color: "#fd7e14" },
    { name: "青色", color: "#20c997" },
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