import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ShootingStarSpawnerProps } from '../types';
import { Z_INDEX_TOKENS } from '../tokens';

interface ActiveStreak {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  currentX: number;
  currentY: number;
  tailX: number;
  tailY: number;
  length: number;
  angle: number;
  progress: number; // 0 to 1
  opacity: number;
  durationMs: number;
  size: number;
  curveOffset: number;
}

interface CapturedStarState {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export const ShootingStarSpawner: React.FC<ShootingStarSpawnerProps> = ({
  onTriggerEasterEgg,
  isCaught = false,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeStreak, setActiveStreak] = useState<ActiveStreak | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [captureState, setCaptureState] = useState<CapturedStarState | null>(null);

  const streakRef = useRef<ActiveStreak | null>(null);
  const captureRef = useRef<CapturedStarState | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTriggeredRef = useRef(false);

  // Spawn a graceful, natural shooting star with 2.8s–3.8s duration
  const spawnShootingStar = useCallback(() => {
    if (disabled || isTriggeredRef.current || typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Random start point in the upper quadrant
    const startX = Math.random() * (width * 0.65) + width * 0.05;
    const startY = Math.random() * (height * 0.3) + height * 0.05;

    // Natural diagonal trajectory
    const direction = Math.random() > 0.2 ? 1 : -1;
    const angle =
      (Math.PI / 180) * (direction > 0 ? 30 + Math.random() * 16 : 142 + Math.random() * 16);

    // Viewport-adaptive distance
    const baseDistance = Math.min(width, height) * (0.65 + Math.random() * 0.3);
    const distance = Math.max(320, Math.min(baseDistance, 950));

    const endX = startX + Math.cos(angle) * distance;
    const endY = startY + Math.sin(angle) * distance;

    // Natural duration: 2800ms to 3800ms for comfortable reading & tapping
    const durationMs = 2800 + Math.random() * 900;

    const newStreak: ActiveStreak = {
      id: Date.now(),
      startX,
      startY,
      endX,
      endY,
      currentX: startX,
      currentY: startY,
      tailX: startX,
      tailY: startY,
      length: Math.max(110, Math.min(190, width * 0.18)),
      angle,
      progress: 0,
      opacity: 0,
      durationMs,
      size: 2.2 + Math.random() * 0.8,
      curveOffset: (Math.random() - 0.5) * 35,
    };

    streakRef.current = newStreak;
    setActiveStreak(newStreak);
  }, [disabled]);

  // Schedule occasional natural spawns
  useEffect(() => {
    if (disabled) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      streakRef.current = null;
      captureRef.current = null;
      setActiveStreak(null);
      setCaptureState(null);
      setIsHovered(false);
      return;
    }

    isTriggeredRef.current = false;

    const scheduleNext = (delayMs: number) => {
      timeoutRef.current = setTimeout(() => {
        if (!isTriggeredRef.current && !disabled) {
          spawnShootingStar();
          // Quiet breathing room between celestial events: 24s to 45s
          const nextDelay = 24000 + Math.random() * 21000;
          scheduleNext(nextDelay);
        }
      }, delayMs);
    };

    // First arrival after 10 - 15 seconds of immersion
    const initialDelay = 10000 + Math.random() * 5000;
    scheduleNext(initialDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [disabled, spawnShootingStar]);

  // Canvas render & animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const streak = streakRef.current;
      const capture = captureRef.current;

      // 1. Regular shooting star in flight
      if (streak && !capture) {
        streak.progress += delta / streak.durationMs;

        if (streak.progress >= 1) {
          streakRef.current = null;
          setActiveStreak(null);
          setIsHovered(false);
        } else {
          const p = streak.progress;
          const easedP = Math.sin((p * Math.PI) / 2);

          const rawX = streak.startX + (streak.endX - streak.startX) * easedP;
          const rawY = streak.startY + (streak.endY - streak.startY) * easedP;
          const arc = Math.sin(p * Math.PI) * streak.curveOffset;

          streak.currentX = rawX - Math.sin(streak.angle) * arc;
          streak.currentY = rawY + Math.cos(streak.angle) * arc;

          let currentOpacity = 0;
          if (p < 0.18) {
            currentOpacity = p / 0.18;
          } else if (p > 0.72) {
            currentOpacity = Math.max(0, 1 - (p - 0.72) / 0.28);
          } else {
            currentOpacity = 1;
          }
          streak.opacity = currentOpacity;

          const trailLength = streak.length * Math.min(1, p * 2.5);
          streak.tailX = streak.currentX - Math.cos(streak.angle) * trailLength;
          streak.tailY = streak.currentY - Math.sin(streak.angle) * trailLength;

          const hoverBoost = isHovered ? 1.35 : 1.0;

          // Gradient trail
          const grad = ctx.createLinearGradient(
            streak.tailX,
            streak.tailY,
            streak.currentX,
            streak.currentY
          );
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(0.5, `rgba(200, 230, 255, ${currentOpacity * 0.35 * hoverBoost})`);
          grad.addColorStop(0.82, `rgba(235, 245, 255, ${currentOpacity * 0.75 * hoverBoost})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${currentOpacity * 0.98 * hoverBoost})`);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(streak.tailX, streak.tailY);
          ctx.lineTo(streak.currentX, streak.currentY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = streak.size * (isHovered ? 1.25 : 1.0);
          ctx.lineCap = 'round';
          ctx.stroke();

          // Head star
          ctx.beginPath();
          ctx.arc(
            streak.currentX,
            streak.currentY,
            streak.size * (isHovered ? 2.0 : 1.6),
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.98})`;
          ctx.shadowColor = isHovered ? 'rgba(230, 245, 255, 1)' : 'rgba(210, 235, 255, 0.85)';
          ctx.shadowBlur = isHovered ? 18 : 12;
          ctx.fill();
          ctx.restore();
        }
      }

      // 2. Cinematic Catch / Burst Animation
      if (capture) {
        const elapsed = currentTime - capture.startTime;
        const catchProgress = Math.min(1, elapsed / 700); // 700ms starlight acceleration burst

        const burstRadius = 6 + catchProgress * 55;
        const burstAlpha = Math.max(0, 1 - catchProgress);

        // Flash & trailing starlight bloom
        ctx.save();
        const flashGrad = ctx.createRadialGradient(
          capture.x,
          capture.y,
          0,
          capture.x,
          capture.y,
          burstRadius * 2.8
        );
        flashGrad.addColorStop(0, `rgba(255, 255, 255, ${burstAlpha * 0.98})`);
        flashGrad.addColorStop(0.35, `rgba(220, 240, 255, ${burstAlpha * 0.8})`);
        flashGrad.addColorStop(0.7, `rgba(160, 205, 255, ${burstAlpha * 0.35})`);
        flashGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(capture.x, capture.y, burstRadius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Expanding starlight rays
        for (let i = 0; i < 8; i++) {
          const rayAngle = capture.angle + (i * Math.PI) / 4 + catchProgress * 0.6;
          const rayLen = (20 + catchProgress * 75) * (1 - catchProgress * 0.25);
          const rx = capture.x + Math.cos(rayAngle) * rayLen;
          const ry = capture.y + Math.sin(rayAngle) * rayLen;

          ctx.beginPath();
          ctx.moveTo(capture.x, capture.y);
          ctx.lineTo(rx, ry);
          ctx.strokeStyle = `rgba(235, 245, 255, ${burstAlpha * 0.85})`;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isHovered]);

  // Graceful interaction trigger
  const handleInteraction = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (isTriggeredRef.current) return;
    if (!activeStreak || activeStreak.opacity < 0.05) return;

    isTriggeredRef.current = true;

    // Record capture position for cinematic burst
    const captured: CapturedStarState = {
      x: activeStreak.currentX,
      y: activeStreak.currentY,
      angle: activeStreak.angle,
      startTime: performance.now(),
    };
    captureRef.current = captured;
    setCaptureState(captured);
    streakRef.current = null;
    setActiveStreak(null);
    setIsHovered(false);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Notify application immediately to start cinematic transition sequence
    onTriggerEasterEgg();
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: Z_INDEX_TOKENS.contentLayer + 15 }}
      aria-hidden="false"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: 'none' }}
      />

      {/* Generous Invisible Interactive Hitbox (2.5x–3x visible star size) */}
      {activeStreak && activeStreak.opacity > 0.05 && !captureState && !disabled && (
        <button
          type="button"
          onClick={handleInteraction}
          onPointerDown={(e) => {
            handleInteraction(e);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Follow the shooting star"
          title="Follow the shooting star"
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer rounded-full focus:outline-none focus:ring-1 focus:ring-white/40 transition-transform duration-150 active:scale-95"
          style={{
            left: `${activeStreak.currentX}px`,
            top: `${activeStreak.currentY}px`,
            width: '150px', // Generous touch target
            height: '150px',
            background: 'transparent',
            touchAction: 'manipulation',
          }}
        >
          <span className="sr-only">Follow the shooting star</span>
        </button>
      )}
    </div>
  );
};
