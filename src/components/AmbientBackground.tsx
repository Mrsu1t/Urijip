import React from 'react';
import { Z_INDEX_TOKENS } from '../tokens';

interface AmbientBackgroundProps {
  scrollProgress?: number;
  className?: string;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  scrollProgress = 0,
  className = '',
}) => {
  return (
    <div
      id="ambient-background"
      className={`fixed inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: Z_INDEX_TOKENS.ambientGlow }}
      aria-hidden="true"
    >
      {/* 1. Deep Space Spectrum Base (Absolute Black to Muted Violet #1C1028) */}
      <div
        className="absolute inset-0 bg-[#000000] transition-opacity duration-1000"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #05050a 40%, #1c1028 100%)',
        }}
      />

      {/* 2. Soft Nebula Pink (#D46CA6) Corner & Atmospheric Screen Layer */}
      <div
        className="absolute top-[-10%] right-[-10%] w-[65vw] max-w-[800px] h-[55vh] max-h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle at 70% 30%, rgba(212, 108, 166, 0.16) 0%, rgba(211, 192, 224, 0.08) 50%, transparent 80%)',
          mixBlendMode: 'screen',
          opacity: Math.max(0.35, 0.85 - scrollProgress * 0.2),
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[55vw] max-w-[700px] h-[45vh] max-h-[500px] rounded-full blur-[130px] pointer-events-none transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle at 30% 70%, rgba(212, 108, 166, 0.12) 0%, rgba(79, 65, 92, 0.1) 60%, transparent 80%)',
          mixBlendMode: 'screen',
          opacity: Math.max(0.25, 0.7 - scrollProgress * 0.2),
        }}
      />

      {/* 3. Shimmering Aurora & Cosmic Dust Curtains */}
      <div
        id="aurora-borealis"
        className="aurora-container"
        style={{
          opacity: Math.max(0.32, 0.82 - scrollProgress * 0.25),
        }}
      >
        <div className="aurora-curtain-1" />
        <div className="aurora-curtain-2" />
        <div className="aurora-curtain-3" />
      </div>

      {/* 4. Subtle Starlight Lavender Atmospheric Horizon Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] max-w-[1100px] h-[35vh] max-h-[450px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(211, 192, 224, 0.18) 0%, rgba(212, 108, 166, 0.12) 40%, transparent 80%)',
          opacity: Math.max(0.25, 0.75 - scrollProgress * 0.3),
        }}
      />

      {/* 5. Cinematic Soft Natural Vignette */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          boxShadow: 'inset 0 0 180px 60px rgba(0, 0, 0, 0.8)',
        }}
      />
    </div>
  );
};


