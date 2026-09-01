import React, { useEffect, useRef } from 'react';
import { StarParticle, StarFieldProps } from '../types';
import { Z_INDEX_TOKENS } from '../tokens';

export const StarField: React.FC<StarFieldProps> = ({
  density = 1,
  speedMultiplier = 1,
  scrollProgress = 0,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<StarParticle[]>([]);
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
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const initStars = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      // Balanced count based on screen area to ensure smooth 60fps across mobile and desktop
      const area = width * height;
      const baseCount = Math.floor((area / 7000) * density);
      const totalStars = Math.max(70, Math.min(baseCount, 260));

      const stars: StarParticle[] = [];

      for (let i = 0; i < totalStars; i++) {
        // Layer distribution: 60% Layer 1 (deep distant), 30% Layer 2 (mid), 10% Layer 3 (foreground soft glow)
        const randLayer = Math.random();
        let layer: 1 | 2 | 3 = 1;
        let size = 0.6 + Math.random() * 0.7;
        let baseAlpha = 0.2 + Math.random() * 0.4;
        let color = '#EAEFF8';

        if (randLayer > 0.9) {
          layer = 3;
          size = 1.4 + Math.random() * 1.0;
          baseAlpha = 0.65 + Math.random() * 0.35;
          color = Math.random() > 0.4 ? '#FFFFFF' : '#E0ECFF';
        } else if (randLayer > 0.6) {
          layer = 2;
          size = 0.9 + Math.random() * 0.8;
          baseAlpha = 0.4 + Math.random() * 0.4;
          color = Math.random() > 0.3 ? '#EDF2FA' : '#D9E6FA';
        }

        const x = Math.random() * width;
        const y = Math.random() * height;

        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size,
          baseAlpha,
          twinkleSpeed: 0.008 + Math.random() * 0.018,
          twinklePhase: Math.random() * Math.PI * 2,
          layer,
          color,
        });
      }

      starsRef.current = stars;
    };

    initStars();

    const resizeObserver = new ResizeObserver(() => {
      initStars();
    });

    resizeObserver.observe(canvas);

    // Subtle cursor/touch interaction for gentle organic depth
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const normX = (clientX / (window.innerWidth || 1) - 0.5) * 2;
      const normY = (clientY / (window.innerHeight || 1) - 0.5) * 2;
      mouseRef.current.targetX = normX * 18;
      mouseRef.current.targetY = normY * 18;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth mouse easing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.03;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.03;

      ctx.clearRect(0, 0, width, height);

      const stars = starsRef.current;
      const len = stars.length;
      const scrollShift = scrollProgress * 120;

      for (let i = 0; i < len; i++) {
        const star = stars[i];

        // Layer-dependent slow organic drift and parallax weight
        const layerDriftRate = star.layer === 3 ? 0.06 : star.layer === 2 ? 0.03 : 0.015;
        const layerParallax = star.layer === 3 ? 1.0 : star.layer === 2 ? 0.6 : 0.25;

        // Extremely slow natural drifting upward/sideways
        star.y -= layerDriftRate * speedMultiplier * (dt * 60);
        star.x += layerDriftRate * 0.3 * speedMultiplier * (dt * 60);

        // Wrap around viewport boundaries seamlessly
        if (star.y < -10) star.y = height + 10;
        if (star.y > height + 10) star.y = -10;
        if (star.x < -10) star.x = width + 10;
        if (star.x > width + 10) star.x = -10;

        // Subtle organic sine twinkle
        star.twinklePhase += star.twinkleSpeed * (dt * 60);
        const twinkleMod = Math.sin(star.twinklePhase) * 0.35;
        const currentAlpha = Math.max(0.08, Math.min(1, star.baseAlpha + twinkleMod));

        // Calculated render position with smooth parallax and scroll offsets
        const posX = star.x + mouseRef.current.x * layerParallax;
        const posY = star.y - scrollShift * layerParallax + mouseRef.current.y * layerParallax;

        // Soft rendering of stars
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;

        if (star.layer === 3) {
          // Foreground luminous star with subtle soft corona
          const gradient = ctx.createRadialGradient(
            posX,
            posY,
            0,
            posX,
            posY,
            star.size * 2.8
          );
          gradient.addColorStop(0, star.color);
          gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
          gradient.addColorStop(1, 'rgba(210, 230, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(posX, posY, star.size * 2.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard and distant crisp stars
          ctx.beginPath();
          ctx.arc(posX, posY, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
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
