import React, { useEffect, useRef } from 'react';
import { StarFieldProps } from '../types';
import { Z_INDEX_TOKENS } from '../tokens';

interface StarConfig {
  count: number;
  sizeMin: number;
  sizeMax: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleAmount: number;
  sparkle?: boolean;
}

interface StarItem {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
  color: string;
}

export const StarField: React.FC<StarFieldProps> = ({
  density = 1,
  speedMultiplier = 1,
  scrollProgress = 0,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Refined star layers: Delicate, tiny pinpoint stars mimicking a crisp clear night sky
    const layerConfigs: StarConfig[] = [
      // LAYER 1: Ultra-tiny distant background pinpoints
      {
        count: Math.round(520 * density),
        sizeMin: 0.4,
        sizeMax: 0.85,
        baseOpacity: 0.35,
        twinkleSpeed: 0.15 * speedMultiplier,
        twinkleAmount: 0.2,
      },
      // LAYER 2: Crisp mid-ground night stars with subtle twinkle
      {
        count: Math.round(220 * density),
        sizeMin: 0.8,
        sizeMax: 1.4,
        baseOpacity: 0.65,
        twinkleSpeed: 0.35 * speedMultiplier,
        twinkleAmount: 0.3,
      },
      // LAYER 3: Bright focal gems with diamond cross-shimmer
      {
        count: Math.max(10, Math.round(30 * density)),
        sizeMin: 1.4,
        sizeMax: 2.4,
        baseOpacity: 0.95,
        twinkleSpeed: 0.22 * speedMultiplier,
        twinkleAmount: 0.35,
        sparkle: true,
      },
    ];

    const starPalettes = [
      'rgba(255, 255, 255,',
      'rgba(240, 246, 255,',
      'rgba(230, 255, 250,',
      'rgba(255, 245, 250,',
    ];

    let starLayers: { config: StarConfig; stars: StarItem[] }[] = [];

    const generateStars = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      starLayers = layerConfigs.map((config) => {
        const stars: StarItem[] = [];
        for (let i = 0; i < config.count; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: config.sizeMin + Math.random() * (config.sizeMax - config.sizeMin),
            phase: Math.random() * Math.PI * 2,
            speed: config.twinkleSpeed * (0.7 + Math.random() * 0.6),
            color: starPalettes[Math.floor(Math.random() * starPalettes.length)],
          });
        }
        return { config, stars };
      });
    };

    generateStars();

    const resizeObserver = new ResizeObserver(() => {
      generateStars();
    });
    resizeObserver.observe(canvas);

    // Pointer interaction for gentle spatial depth
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const normX = (clientX / (window.innerWidth || 1) - 0.5) * 2;
      const normY = (clientY / (window.innerHeight || 1) - 0.5) * 2;
      mouseRef.current.targetX = normX * 10;
      mouseRef.current.targetY = normY * 10;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let startTime = performance.now();

    const render = (now: number) => {
      const t = (now - startTime) / 1000;

      // Smooth mouse easing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.03;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.03;

      ctx.clearRect(0, 0, width, height);

      const scrollShift = scrollProgress * 50;

      starLayers.forEach((layer, layerIdx) => {
        const { config, stars } = layer;
        const parallax = layerIdx === 2 ? 0.9 : layerIdx === 1 ? 0.5 : 0.2;

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];

          let opacity = config.baseOpacity;
          if (config.twinkleSpeed > 0) {
            const flicker = Math.sin(t * s.speed + s.phase);
            opacity = config.baseOpacity + flicker * config.twinkleAmount;
            opacity = Math.max(0.1, Math.min(1, opacity));
          }

          let renderX = (s.x + mouseRef.current.x * parallax) % width;
          let renderY = (s.y - scrollShift * parallax + mouseRef.current.y * parallax) % height;
          if (renderX < 0) renderX += width;
          if (renderY < 0) renderY += height;

          // Sparkle 4-point cross for large bright stars
          if (config.sparkle && s.size > 1.8) {
            const cx = renderX;
            const cy = renderY;
            const r = s.size * 2.5;

            ctx.save();
            ctx.globalAlpha = opacity * 0.85;
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            grad.addColorStop(0.5, 'rgba(200, 240, 255, 0.4)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(cx - r * 1.2, cy);
            ctx.lineTo(cx + r * 1.2, cy);
            ctx.moveTo(cx, cy - r * 1.2);
            ctx.lineTo(cx, cy + r * 1.2);
            ctx.stroke();
            ctx.restore();
          }

          ctx.beginPath();
          ctx.fillStyle = `${s.color}${opacity})`;
          ctx.arc(renderX, renderY, s.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    animationFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [density, speedMultiplier, scrollProgress]);

  return (
    <canvas
      id="starfield-canvas"
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: Z_INDEX_TOKENS.starField }}
      aria-hidden="true"
    />
  );
};
