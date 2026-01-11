"use client";

import { useMemo } from "react";

interface MeshBackgroundProps {
  primaryColor: string;
  additionalColors?: string[];
  seed?: number;
}

export const MeshBackground = ({ primaryColor, additionalColors = [], seed = 0 }: MeshBackgroundProps) => {
  // Generate 6 random blobs based on the primary color and some logic
  const blobs = useMemo(() => {
    const color = primaryColor || "#f97316";
    const colors = additionalColors.length > 0 ? additionalColors : [color, '#fbbf24', '#ec4899', '#8b5cf6', '#3b82f6'];
    
    // Simple deterministic pseudo-random logic based on seed
    const pseudoRandom = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
    };

    return [
      { color: colors[0], top: `${10 + pseudoRandom(1)*20}%`, left: `${10 + pseudoRandom(2)*20}%`, width: '80%', height: '80%', opacity: 0.6 },
      { color: colors[1 % colors.length], top: `${40 + pseudoRandom(3)*20}%`, left: `${50 + pseudoRandom(4)*20}%`, width: '75%', height: '75%', opacity: 0.4 },
      { color: colors[2 % colors.length], top: `${10 + pseudoRandom(5)*30}%`, left: `${60 + pseudoRandom(6)*30}%`, width: '70%', height: '70%', opacity: 0.3 },
      { color: colors[3 % colors.length], top: `${60 + pseudoRandom(7)*30}%`, left: `${10 + pseudoRandom(8)*30}%`, width: '65%', height: '65%', opacity: 0.3 },
      { color: colors[4 % colors.length], top: `${70 + pseudoRandom(9)*20}%`, left: `${70 + pseudoRandom(10)*20}%`, width: '60%', height: '60%', opacity: 0.2 },
      { color: color, top: `${30 + pseudoRandom(11)*40}%`, left: `${30 + pseudoRandom(12)*40}%`, width: '90%', height: '90%', opacity: 0.2 },
    ];
  }, [primaryColor, additionalColors, seed]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      {/* Mesh Blobs */}
      <div className="absolute inset-0 filter blur-[100px] opacity-70">
        {blobs.map((blob, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: blob.color,
              top: blob.top,
              left: blob.left,
              width: blob.width,
              height: blob.height,
              opacity: blob.opacity,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {/* Grain/Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Subtle vignettes */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/5" />
    </div>
  );
};