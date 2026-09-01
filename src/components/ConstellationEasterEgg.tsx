import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ConstellationEasterEggProps } from '../types';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface ConstellationPoint {
  x: number; // 0 to 1 relative to canvas
  y: number;
  r: number;
  brightness: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface Constellation {
  name: string;
  points: ConstellationPoint[];
  lines: [number, number][]; // pairs of point indices
}

interface AmbientStar {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  depth: number;
  phase: number;
  speed: number;
}

export const ConstellationEasterEgg: React.FC<ConstellationEasterEggProps> = ({
  isOpen,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Staged entrance animation steps:
  // 0: Deep space initialization (0ms)
  // 1: Faint stars start twinkling (150ms)
  // 2: Full starfield emerges (500ms)
  // 3: Constellation lines trace (900ms)
  // 4: "YOU ARE" reveals (1300ms)
  // 5: "ALL I EVER" reveals (1900ms)
  // 6: "WISHED FOR." reveals (2500ms)
  // 7: Universe scroll & interactive (3000ms+)
  const [arrivalStage, setArrivalStage] = useState<number>(0);
  const [scrollYProgress, setScrollYProgress] = useState<number>(0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Prevent background body scroll when Easter Egg is open to preserve exact reading spot
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Escape key handler for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fluid Staged Entrance Timeline
  useEffect(() => {
    if (!isOpen) {
      setArrivalStage(0);
      setScrollYProgress(0);
      setPanOffset({ x: 0, y: 0 });
      return;
    }

    const t1 = setTimeout(() => setArrivalStage(1), 150);
    const t2 = setTimeout(() => setArrivalStage(2), 500);
    const t3 = setTimeout(() => setArrivalStage(3), 900);
    const t4 = setTimeout(() => setArrivalStage(4), 1300);
    const t5 = setTimeout(() => setArrivalStage(5), 1900);
    const t6 = setTimeout(() => setArrivalStage(6), 2500);
    const t7 = setTimeout(() => setArrivalStage(7), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, [isOpen]);

  // Handle vertical scroll inside the celestial sanctuary
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
    setScrollYProgress(progress);
  };

  // Canvas starfield & constellation rendering
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Layered ambient stars (faint background, medium midground, bright foreground)
    const starCount = Math.floor(Math.min(width, 1600) * 0.45);
    const ambientStars: AmbientStar[] = Array.from({ length: starCount }, () => {
      const depth = Math.random() * 0.85 + 0.15;
      return {
        x: Math.random() * width,
        y: Math.random() * height * 1.8,
        size: depth > 0.7 ? Math.random() * 1.6 + 0.8 : Math.random() * 0.9 + 0.3,
        baseAlpha: depth > 0.7 ? Math.random() * 0.6 + 0.4 : Math.random() * 0.45 + 0.2,
        depth,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0012 + Math.random() * 0.002,
      };
    });

    // Abstract Framing Constellations
    const constelTL: Constellation = {
      name: 'North Haven',
      points: [
        { x: 0.1, y: 0.14, r: 2.4, brightness: 0.95, twinkleSpeed: 0.002, twinklePhase: 0 },
        { x: 0.17, y: 0.1, r: 1.9, brightness: 0.85, twinkleSpeed: 0.0018, twinklePhase: 1 },
        { x: 0.25, y: 0.13, r: 2.5, brightness: 1.0, twinkleSpeed: 0.0025, twinklePhase: 2 },
        { x: 0.2, y: 0.22, r: 2.0, brightness: 0.88, twinkleSpeed: 0.0015, twinklePhase: 3 },
        { x: 0.12, y: 0.27, r: 2.1, brightness: 0.92, twinkleSpeed: 0.0022, twinklePhase: 4 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [0, 3],
      ],
    };

    const constelTR: Constellation = {
      name: 'Starlight Veil',
      points: [
        { x: 0.77, y: 0.13, r: 2.2, brightness: 0.92, twinkleSpeed: 0.0019, twinklePhase: 1.5 },
        { x: 0.84, y: 0.09, r: 2.6, brightness: 1.0, twinkleSpeed: 0.0024, twinklePhase: 0.8 },
        { x: 0.91, y: 0.15, r: 2.0, brightness: 0.86, twinkleSpeed: 0.0017, twinklePhase: 2.2 },
        { x: 0.85, y: 0.23, r: 2.3, brightness: 0.95, twinkleSpeed: 0.0021, twinklePhase: 3.1 },
        { x: 0.76, y: 0.21, r: 1.9, brightness: 0.82, twinkleSpeed: 0.0014, twinklePhase: 4.0 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    };

    const constelBL: Constellation = {
      name: 'True Harbor',
      points: [
        { x: 0.12, y: 0.76, r: 2.5, brightness: 0.98, twinkleSpeed: 0.0022, twinklePhase: 0.4 },
        { x: 0.21, y: 0.72, r: 2.0, brightness: 0.88, twinkleSpeed: 0.0018, twinklePhase: 1.9 },
        { x: 0.26, y: 0.83, r: 2.7, brightness: 1.0, twinkleSpeed: 0.0026, twinklePhase: 3.5 },
        { x: 0.18, y: 0.88, r: 2.1, brightness: 0.9, twinkleSpeed: 0.002, twinklePhase: 2.7 },
        { x: 0.09, y: 0.84, r: 1.8, brightness: 0.82, twinkleSpeed: 0.0016, twinklePhase: 4.8 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
        [1, 3],
      ],
    };

    const constelBR: Constellation = {
      name: 'Eternal Promise',
      points: [
        { x: 0.75, y: 0.79, r: 2.1, brightness: 0.9, twinkleSpeed: 0.0016, twinklePhase: 2.4 },
        { x: 0.82, y: 0.73, r: 2.6, brightness: 1.0, twinkleSpeed: 0.0023, twinklePhase: 0.6 },
        { x: 0.89, y: 0.77, r: 2.0, brightness: 0.85, twinkleSpeed: 0.0019, twinklePhase: 1.8 },
        { x: 0.87, y: 0.87, r: 2.4, brightness: 0.96, twinkleSpeed: 0.0025, twinklePhase: 3.2 },
        { x: 0.79, y: 0.9, r: 1.9, brightness: 0.84, twinkleSpeed: 0.0014, twinklePhase: 4.5 },
      ],
      lines: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 0],
      ],
    };

    const constellations = [constelTL, constelTR, constelBL, constelBR];

    let lastTime = performance.now();
    let lineDrawProgress = 0;

    const render = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Deep space base radial gradient
      const scrollDriftY = scrollYProgress * height * 0.35;
      const bgGrad = ctx.createRadialGradient(
        width * 0.5 + panOffset.x * 0.1,
        height * 0.45 + panOffset.y * 0.1 - scrollDriftY * 0.2,
        width * 0.08,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.95
      );
      bgGrad.addColorStop(0, '#091224');
      bgGrad.addColorStop(0.35, '#050B18');
      bgGrad.addColorStop(0.75, '#03050B');
      bgGrad.addColorStop(1, '#020306');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 1. Ambient Starfield
      const starGlobalAlpha =
        arrivalStage === 0
          ? 0.4
          : arrivalStage === 1
          ? 0.7
          : arrivalStage === 2
          ? 0.9
          : 1.0;

      for (let i = 0; i < ambientStars.length; i++) {
        const s = ambientStars[i];
        s.phase += s.speed * delta;
        const twinkle = 0.8 + Math.sin(s.phase) * 0.2;

        const sx = (s.x + panOffset.x * s.depth + width) % width;
        const baseSy = s.y - scrollDriftY * s.depth * 1.2;
        const sy = ((baseSy % height) + height) % height;

        // Keep central region behind main text clean & high-contrast
        const distX = Math.abs(sx - width * 0.5) / (width * 0.5);
        const distY = Math.abs(sy - height * 0.48) / (height * 0.48);
        const centerProximity = Math.sqrt(distX * distX + distY * distY);
        const centerQuietFactor = centerProximity < 0.45 ? 0.25 + centerProximity * 1.5 : 1.0;

        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 242, 255, ${
          s.baseAlpha * twinkle * starGlobalAlpha * centerQuietFactor
        })`;
        ctx.fill();
      }

      // 2. Constellations
      if (arrivalStage >= 2) {
        if (arrivalStage >= 3 && lineDrawProgress < 1) {
          lineDrawProgress = Math.min(1, lineDrawProgress + 0.0016 * delta);
        }

        const constelAlpha = arrivalStage === 2 ? 0.5 : 1.0;

        constellations.forEach((c) => {
          const computedPoints = c.points.map((p) => {
            const px = p.x * width + panOffset.x * 0.35;
            const py = p.y * height + panOffset.y * 0.35 - scrollDriftY * 0.4;
            p.twinklePhase += p.twinkleSpeed * delta;
            const twinkle = 0.82 + Math.sin(p.twinklePhase) * 0.18;
            return {
              x: px,
              y: py,
              r: p.r,
              brightness: p.brightness * twinkle * constelAlpha,
            };
          });

          // Draw thin connecting lines
          if (lineDrawProgress > 0) {
            ctx.save();
            ctx.strokeStyle = `rgba(215, 235, 255, ${0.3 * lineDrawProgress * constelAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.lineCap = 'round';

            c.lines.forEach(([p1Idx, p2Idx]) => {
              const p1 = computedPoints[p1Idx];
              const p2 = computedPoints[p2Idx];
              if (!p1 || !p2) return;

              const curX = p1.x + (p2.x - p1.x) * lineDrawProgress;
              const curY = p1.y + (p2.y - p1.y) * lineDrawProgress;

              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(curX, curY);
              ctx.stroke();
            });
            ctx.restore();
          }

          // Draw constellation star nodes
          computedPoints.forEach((p) => {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 215, 255, ${0.2 * p.brightness})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.brightness})`;
            ctx.shadowColor = 'rgba(210, 235, 255, 0.85)';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.restore();
          });
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, arrivalStage, panOffset, scrollYProgress]);

  // Mouse pan interaction
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (arrivalStage < 3) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dx = (clientX - centerX) * 0.03;
    const dy = (clientY - centerY) * 0.03;
    setPanOffset({ x: -dx, y: -dy });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      id="constellation-easter-egg-universe"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={handlePointerMove}
      className="fixed inset-0 w-full h-[100svh] bg-[#020306] text-[#EAEFF8] flex flex-col select-none overflow-hidden"
      style={{ zIndex: 100 }}
      role="dialog"
      aria-modal="true"
      aria-label="Constellation Secret: You Are All I Ever Wished For"
    >
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />

      {/* Top Fixed Header: Subtle Return Button */}
      <header className="fixed top-0 left-0 right-0 w-full flex items-center justify-between px-5 sm:px-10 pt-5 sm:pt-7 z-40 pointer-events-none">
        <motion.button
          type="button"
          onClick={onClose}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: arrivalStage >= 3 ? 1 : 0, y: arrivalStage >= 3 ? 0 : -10 }}
          transition={{ duration: 0.6 }}
          aria-label="Return to our story"
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-white/[0.08] hover:bg-white/[0.16] active:bg-white/[0.22] transition-all duration-200 text-white/85 hover:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md shadow-lg shadow-black/40"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-200" />
          <span className="font-body text-xs uppercase tracking-[0.24em] font-semibold">
            Return to our story
          </span>
        </motion.button>

        {/* Secret Wish indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: arrivalStage >= 3 ? 0.75 : 0 }}
          transition={{ duration: 0.8 }}
          className="hidden sm:flex items-center gap-2 text-white/50 font-body text-[11px] uppercase tracking-[0.28em]"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200/80" />
          <span>Secret Wish Found</span>
        </motion.div>
      </header>

      {/* Scrollable Celestial Sanctuary Track */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative w-full h-full overflow-y-auto overflow-x-hidden z-30"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Section 1: Main Message Viewport */}
        <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center px-4 sm:px-8 text-center pt-20 pb-16">
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 max-w-4xl mx-auto w-full">
            {/* Stage 1: "YOU ARE" */}
            <motion.div
              initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
              animate={{
                opacity: arrivalStage >= 4 ? 1 : 0,
                y: arrivalStage >= 4 ? 0 : 22,
                filter: arrivalStage >= 4 ? 'blur(0px)' : 'blur(10px)',
              }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <h1
                id="secret-message-you-are"
                className="font-editorial text-[clamp(2.2rem,6.5vw,5rem)] font-bold text-white uppercase tracking-[0.16em] sm:tracking-[0.22em] leading-[1.18] select-none text-center"
                style={{
                  textShadow:
                    '0 0 35px rgba(220, 235, 255, 0.85), 0 0 75px rgba(180, 215, 255, 0.4)',
                }}
              >
                YOU ARE
              </h1>
            </motion.div>

            {/* Stage 2: "ALL I EVER" */}
            <motion.div
              initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
              animate={{
                opacity: arrivalStage >= 5 ? 1 : 0,
                y: arrivalStage >= 5 ? 0 : 22,
                filter: arrivalStage >= 5 ? 'blur(0px)' : 'blur(10px)',
              }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <h1
                id="secret-message-all-i-ever"
                className="font-editorial text-[clamp(2.2rem,6.5vw,5rem)] font-bold text-blue-50/95 uppercase tracking-[0.16em] sm:tracking-[0.22em] leading-[1.18] select-none text-center"
                style={{
                  textShadow:
                    '0 0 35px rgba(220, 235, 255, 0.85), 0 0 75px rgba(180, 215, 255, 0.4)',
                }}
              >
                ALL I EVER
              </h1>
            </motion.div>

            {/* Stage 3: "WISHED FOR." */}
            <motion.div
              initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
              animate={{
                opacity: arrivalStage >= 6 ? 1 : 0,
                y: arrivalStage >= 6 ? 0 : 22,
                filter: arrivalStage >= 6 ? 'blur(0px)' : 'blur(10px)',
              }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <h1
                id="secret-message-wished-for"
                className="font-editorial text-[clamp(2.2rem,6.5vw,5rem)] font-bold text-white uppercase tracking-[0.16em] sm:tracking-[0.22em] leading-[1.18] select-none text-center"
                style={{
                  textShadow:
                    '0 0 45px rgba(255, 255, 255, 0.95), 0 0 90px rgba(180, 215, 255, 0.55)',
                }}
              >
                WISHED FOR.
              </h1>
            </motion.div>

            {/* Subtle starlight focal aura */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: arrivalStage >= 6 ? [0.3, 0.5, 0.3] : 0,
                scale: arrivalStage >= 6 ? [1, 1.06, 1] : 0.9,
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-52 h-52 sm:w-72 sm:h-72 rounded-full bg-[radial-gradient(circle,_rgba(215,235,255,0.22)_0%,_rgba(140,185,255,0.06)_50%,_transparent_75%)] blur-2xl pointer-events-none mt-2"
            />
          </div>

          {/* Scroll guidance hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: arrivalStage >= 7 ? 0.6 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-8 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="font-body text-[10px] sm:text-xs text-blue-100/60 uppercase tracking-[0.28em]">
              Scroll through the sky
            </span>
            <div className="w-[1px] h-6 bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </section>

        {/* Section 2: Deep Celestial Drift Section */}
        <section className="relative w-full min-h-[110svh] flex flex-col items-center justify-center px-6 text-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 0.85, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto flex flex-col items-center space-y-6"
          >
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />
            <p className="font-editorial text-2xl sm:text-3xl text-blue-100/90 font-light italic leading-relaxed">
              Across every star, across every night, there was only ever you.
            </p>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />

            {/* Bottom Return Button inside the scroll track */}
            <div className="pt-8">
              <button
                type="button"
                onClick={onClose}
                aria-label="Return to our story from bottom"
                className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/20 bg-white/[0.08] hover:bg-white/[0.16] active:bg-white/[0.22] transition-all duration-200 text-white/85 hover:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md shadow-lg shadow-black/50"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-blue-200" />
                <span className="font-body text-xs uppercase tracking-[0.24em] font-semibold">
                  Return to our story
                </span>
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
};
