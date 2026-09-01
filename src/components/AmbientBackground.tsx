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
      {/* Base deep atmospheric sky gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse 90% 75% at 50% 35%, #0A121F 0%, #060910 50%, #04060A 100%)',
          opacity: 1 - scrollProgress * 0.3,
        }}
      />

      {/* Subtle midnight-blue focal glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[850px] h-[50vh] max-h-[600px] rounded-full blur-[110px] pointer-events-none transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(20, 36, 62, 0.45) 0%, rgba(10, 18, 32, 0.15) 60%, transparent 100%)',
          transform: `translate(-50%, calc(-50% - ${scrollProgress * 50}px)) scale(${1 + scrollProgress * 0.15})`,
          opacity: Math.max(0.3, 0.8 - scrollProgress * 0.4),
        }}
      />

      {/* Subtle starlight warmth accent aura */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] max-w-[400px] h-[40vw] max-h-[400px] rounded-full blur-[80px] pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(160, 200, 255, 0.08) 0%, rgba(200, 220, 255, 0.02) 50%, transparent 100%)',
          opacity: 0.6,
        }}
      />

      {/* Cinematic subtle vignette to softly frame the viewport without darkening corners excessively */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          boxShadow: 'inset 0 0 160px 40px rgba(2, 3, 5, 0.45)',
          opacity: Math.max(0.15, 0.6 - scrollProgress * 0.45),
        }}
      />
    </div>
  );
};
