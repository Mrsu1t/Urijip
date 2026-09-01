import React, { useState, useEffect, useRef } from 'react';
import { HiddenMoonProps } from '../types';
import { Z_INDEX_TOKENS } from '../tokens';
import { createMoonTexture } from '../utils/celestialRenderer';

export const HiddenMoon: React.FC<HiddenMoonProps> = ({
  onTriggerUniverse,
  isTriggering = false,
  disabled = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render high-resolution photorealistic lunar surface on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 128;
    canvas.width = size;
    canvas.height = size;

    const renderSurface = () => {
      const moonTex = createMoonTexture(size);
      ctx.clearRect(0, 0, size, size);

      // Clip to spherical disc
      ctx.save();
      ctx.beginPath();
      ctx.arc(size * 0.5, size * 0.5, size * 0.49, 0, Math.PI * 2);
      ctx.clip();

      // Draw photorealistic surface
      ctx.drawImage(moonTex, 0, 0, size, size);

      // 3D Directional Sunlight Shading (Sun vector from upper-left 135 deg)
      const sunTerminator = ctx.createLinearGradient(
        size * 0.15,
        size * 0.15,
        size * 0.95,
        size * 0.95
      );
      sunTerminator.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      sunTerminator.addColorStop(0.38, 'rgba(0, 0, 0, 0)');
      sunTerminator.addColorStop(0.58, 'rgba(8, 12, 20, 0.52)');
      sunTerminator.addColorStop(0.82, 'rgba(3, 5, 10, 0.92)');
      sunTerminator.addColorStop(1, 'rgba(0, 0, 2, 0.99)');
      ctx.fillStyle = sunTerminator;
      ctx.fillRect(0, 0, size, size);

      // Subtle edge limb darkening
      const limbGrad = ctx.createRadialGradient(
        size * 0.5,
        size * 0.5,
        size * 0.38,
        size * 0.5,
        size * 0.5,
        size * 0.49
      );
      limbGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      limbGrad.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
      ctx.fillStyle = limbGrad;
      ctx.beginPath();
      ctx.arc(size * 0.5, size * 0.5, size * 0.49, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    renderSurface();

    const img = new Image();
    img.src = '/assets/moon.jpg';
    img.onload = () => {
      renderSurface();
    };
  }, []);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (disabled || isTriggering) return;
    onTriggerUniverse();
  };

  return (
    <div
      id="hidden-celestial-moon-container"
      className={`fixed top-7 right-7 sm:top-10 sm:right-12 pointer-events-none transition-all duration-700 select-none ${className}`}
      style={{
        zIndex: Z_INDEX_TOKENS.contentLayer + 12,
      }}
    >
      {/* Invisible Generous Touch Target Button (80px x 80px) */}
      <button
        type="button"
        onClick={handleClick}
        onTouchEnd={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled || isTriggering}
        aria-label="Explore celestial body"
        title=""
        className="relative group w-20 h-20 -m-5 flex items-center justify-center pointer-events-auto cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/30 rounded-full transition-transform active:scale-95"
        style={{
          touchAction: 'manipulation',
          background: 'transparent',
        }}
      >
        {/* Natural Ambient Starlight Diffuse Halo (Never artificial neon) */}
        <div
          className={`absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(215,228,245,0.18)_0%,_rgba(180,200,225,0.04)_50%,_transparent_75%)] blur-md transition-all duration-700 ${
            isTriggering
              ? 'scale-[3.5] opacity-100'
              : isHovered
              ? 'scale-125 opacity-60'
              : 'scale-100 opacity-30'
          }`}
        />

        {/* Photorealistic Celestial Moon Container */}
        <div
          className={`relative rounded-full transition-all duration-700 ease-out overflow-hidden shadow-2xl ${
            isTriggering
              ? 'w-16 h-16 sm:w-20 sm:h-20 scale-[12] sm:scale-[18] opacity-100'
              : isHovered
              ? 'w-8 h-8 sm:w-9 sm:h-9 scale-105 opacity-95'
              : 'w-7 h-7 sm:w-8 sm:h-8 scale-100 opacity-80'
          }`}
          style={{
            background: '#04070D',
            boxShadow: isTriggering
              ? '0 0 60px rgba(220, 235, 255, 0.95), inset -4px -4px 10px rgba(2, 4, 8, 0.95)'
              : isHovered
              ? '0 0 14px rgba(200, 220, 245, 0.4), inset -2px -2px 5px rgba(2, 4, 8, 0.9)'
              : '0 0 8px rgba(180, 205, 235, 0.22), inset -2px -2px 4px rgba(2, 4, 8, 0.9)',
          }}
        >
          {/* Photorealistic Procedural Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block rounded-full pointer-events-none"
          />
        </div>

        <span className="sr-only">Explore celestial body</span>
      </button>
    </div>
  );
};
