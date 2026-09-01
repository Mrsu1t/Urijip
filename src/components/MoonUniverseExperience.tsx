import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MoonUniverseExperienceProps } from '../types';
import { ArrowLeft, Sparkles, Orbit } from 'lucide-react';
import {
  initializeCelestialTextures,
  CelestialTextures,
  DistantGalaxyData,
  GalaxyParticleData,
} from '../utils/celestialRenderer';

interface SpectralStar {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
  color: string;
  hasSpikes: boolean;
}

export const MoonUniverseExperience: React.FC<MoonUniverseExperienceProps> = ({
  isOpen,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const texturesRef = useRef<CelestialTextures | null>(null);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when universe is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle internal scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const total = scrollHeight - clientHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, scrollTop / total)) : 0;
    setScrollProgress(p);
  };

  // Canvas-based Ultra-Realistic Cosmic Rendering Architecture
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize photorealistic procedural textures once
    if (!texturesRef.current) {
      texturesRef.current = initializeCelestialTextures();
    }
    const textures = texturesRef.current;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Initialize Deep Space Spectral Starfield (Realistic Morgan-Keenan spectral classifications)
    const starCount = Math.floor(Math.min(width, 1920) * 0.75);
    const deepStars: SpectralStar[] = Array.from({ length: starCount }, () => {
      const z = Math.random() * 0.9 + 0.1;
      const typeRoll = Math.random();
      let color = 'rgba(255, 255, 255,'; // Class A/F White
      let hasSpikes = false;

      if (typeRoll > 0.88) {
        color = 'rgba(195, 222, 255,'; // Class O/B Hot Blue
        hasSpikes = z > 0.85 && Math.random() > 0.75;
      } else if (typeRoll > 0.7) {
        color = 'rgba(255, 244, 225,'; // Class G Sun-like Yellow-White
        hasSpikes = z > 0.85 && Math.random() > 0.8;
      } else if (typeRoll > 0.58) {
        color = 'rgba(255, 215, 175,'; // Class K Orange Giant
      } else if (typeRoll > 0.5) {
        color = 'rgba(255, 185, 165,'; // Class M Red Dwarf
      }

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        size: z > 0.75 ? Math.random() * 1.6 + 0.9 : Math.random() * 0.8 + 0.3,
        alpha: z > 0.75 ? Math.random() * 0.55 + 0.45 : Math.random() * 0.35 + 0.15,
        speed: 0.0006 + Math.random() * 0.0012,
        phase: Math.random() * Math.PI * 2,
        color,
        hasSpikes,
      };
    });

    // Initialize Realistic Milky Way Spiral Galaxy (Logarithmic Arms, Bulge, HII Regions, Dust Lanes)
    const galaxyParticles: GalaxyParticleData[] = Array.from({ length: 650 }, (_, i) => {
      const numArms = 4;
      const armIndex = i % numArms;
      const armBaseAngle = (armIndex * 2 * Math.PI) / numArms;
      const distRatio = Math.pow(Math.random(), 1.35); // Concentrated toward center
      const angleOffset = (Math.random() - 0.5) * 0.38;

      let type: GalaxyParticleData['type'] = 'blue_star';
      let color = 'rgba(190, 220, 255,';
      let size = Math.random() * 1.5 + 0.5;
      let alpha = Math.random() * 0.65 + 0.35;

      if (distRatio < 0.22) {
        type = 'core';
        color = 'rgba(255, 238, 200,'; // Warm Population II core
        size = Math.random() * 2.0 + 0.8;
        alpha = Math.random() * 0.75 + 0.4;
      } else if (Math.random() > 0.82) {
        type = 'hii_region';
        color = 'rgba(255, 160, 205,'; // Glowing Pink/Magenta HII Star-forming nurseries
        size = Math.random() * 2.2 + 0.9;
        alpha = 0.8;
      } else if (Math.random() > 0.7) {
        type = 'dust';
        color = 'rgba(30, 22, 20,'; // Dark obscuring interstellar dust
        size = Math.random() * 3.5 + 1.5;
        alpha = 0.55;
      }

      return {
        arm: armBaseAngle,
        distRatio,
        angleOffset,
        speed: 0.00015 + (1 - distRatio) * 0.00035,
        size,
        alpha,
        type,
        color,
      };
    });

    // Initialize Deep Field Distant Galaxies (Hubble/JWST morphology: Spirals, Ellipticals, Edge-ons)
    const distantGalaxies: DistantGalaxyData[] = Array.from({ length: 36 }, (_, idx) => {
      const morphologies: DistantGalaxyData['morphology'][] = ['spiral', 'elliptical', 'edge_on', 'barred'];
      const morph = morphologies[idx % morphologies.length];
      const redshift = Math.random(); // 0 (nearby blue/white) to 1 (distant redshifted amber)

      const coreColor = redshift > 0.6 ? '255, 220, 180' : '240, 245, 255';
      const diskColor = redshift > 0.6 ? '235, 190, 150' : '185, 215, 255';

      return {
        x: (Math.random() - 0.5) * width * 1.5 + width * 0.5,
        y: (Math.random() - 0.5) * height * 1.5 + height * 0.5,
        rx: Math.random() * 18 + 7,
        ry: morph === 'edge_on' ? Math.random() * 4 + 2 : Math.random() * 11 + 5,
        angle: Math.random() * Math.PI,
        morphology: morph,
        alpha: Math.random() * 0.4 + 0.2,
        coreColor,
        diskColor,
        dustLane: morph === 'edge_on' || (morph === 'spiral' && Math.random() > 0.5),
        redshift,
      };
    });

    let lastTime = performance.now();

    const range = (
      val: number,
      inMin: number,
      inMax: number,
      outMin: number,
      outMax: number
    ) => {
      if (val <= inMin) return outMin;
      if (val >= inMax) return outMax;
      return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
    };

    const render = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Deep space astronomical void base
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        width * 0.05,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.9
      );
      bgGrad.addColorStop(0, '#040711');
      bgGrad.addColorStop(0.45, '#020409');
      bgGrad.addColorStop(0.85, '#010204');
      bgGrad.addColorStop(1, '#000001');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const p = scrollProgress; // 0.0 to 1.0
      const cx = width * 0.5;
      const cy = height * 0.5;

      // =========================================================
      // 1. DEEP SPACE STARFIELD & FOREGROUND DIFFRACTION SPIKES
      // =========================================================
      const starVisibility = range(p, 0.0, 0.15, 0.4, 1.0);
      const starParallaxScale = 1.0 + p * 0.45;

      for (let i = 0; i < deepStars.length; i++) {
        const s = deepStars[i];
        s.phase += s.speed * delta;
        const twinkle = 0.88 + Math.sin(s.phase) * 0.12;

        const offsetX = (s.x - cx) * starParallaxScale;
        const offsetY = (s.y - cy) * starParallaxScale;
        const sx = cx + offsetX;
        const sy = cy + offsetY;

        if (sx >= -20 && sx <= width + 20 && sy >= -20 && sy <= height + 20) {
          ctx.beginPath();
          ctx.arc(sx, sy, s.size * (0.8 + s.z * 0.35), 0, Math.PI * 2);
          ctx.fillStyle = `${s.color}${s.alpha * twinkle * starVisibility})`;
          ctx.fill();

          // Realistic 4-point astronomical diffraction spikes on bright stars
          if (s.hasSpikes && s.alpha * starVisibility > 0.4) {
            ctx.save();
            ctx.strokeStyle = `${s.color}${s.alpha * 0.35 * starVisibility})`;
            ctx.lineWidth = 0.6;
            const spikeLen = s.size * 5.5;
            ctx.beginPath();
            ctx.moveTo(sx - spikeLen, sy);
            ctx.lineTo(sx + spikeLen, sy);
            ctx.moveTo(sx, sy - spikeLen);
            ctx.lineTo(sx, sy + spikeLen);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // =========================================================
      // 2. STAGES 1 & 2: PHOTOREALISTIC MOON (0.00 -> 0.26)
      // High-resolution procedural texture, 3D Lambertian cosine terminator shading
      // =========================================================
      if (p < 0.28) {
        const moonProgress = range(p, 0.0, 0.24, 0, 1);
        const moonRadius = range(moonProgress, 0, 1, Math.min(width, height) * 0.68, 16);
        const moonAlpha = range(moonProgress, 0.75, 1.0, 1.0, 0.0);

        const moonCenterX = range(moonProgress, 0, 1, cx, cx + width * 0.22);
        const moonCenterY = range(moonProgress, 0, 1, cy, cy - height * 0.08);

        ctx.save();
        ctx.globalAlpha = moonAlpha;

        // Clip to lunar sphere
        ctx.beginPath();
        ctx.arc(moonCenterX, moonCenterY, moonRadius, 0, Math.PI * 2);
        ctx.clip();

        // 1. Draw photorealistic lunar surface texture
        ctx.drawImage(
          textures.moon,
          moonCenterX - moonRadius,
          moonCenterY - moonRadius,
          moonRadius * 2,
          moonRadius * 2
        );

        // 2. Spherical 3D directional sunlight shading (Sun illumination from upper-left 135 deg)
        // High-contrast natural vacuum terminator
        const sunTerminator = ctx.createLinearGradient(
          moonCenterX - moonRadius * 0.7,
          moonCenterY - moonRadius * 0.7,
          moonCenterX + moonRadius * 0.85,
          moonCenterY + moonRadius * 0.85
        );
        sunTerminator.addColorStop(0, 'rgba(255, 255, 255, 0.1)');  // Direct subsolar point
        sunTerminator.addColorStop(0.38, 'rgba(0, 0, 0, 0)');
        sunTerminator.addColorStop(0.55, 'rgba(8, 12, 20, 0.45)');   // Grazing shadow onset
        sunTerminator.addColorStop(0.72, 'rgba(3, 5, 10, 0.88)');    // Deep shadow
        sunTerminator.addColorStop(1, 'rgba(0, 0, 2, 0.98)');        // Pitch black lunar night

        ctx.fillStyle = sunTerminator;
        ctx.fillRect(
          moonCenterX - moonRadius,
          moonCenterY - moonRadius,
          moonRadius * 2,
          moonRadius * 2
        );

        // 3. Ultra-subtle spherical edge falloff (Fresnel / limb darkening)
        const limbShadow = ctx.createRadialGradient(
          moonCenterX,
          moonCenterY,
          moonRadius * 0.75,
          moonCenterX,
          moonCenterY,
          moonRadius
        );
        limbShadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
        limbShadow.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
        ctx.fillStyle = limbShadow;
        ctx.beginPath();
        ctx.arc(moonCenterX, moonCenterY, moonRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // =========================================================
      // 3. STAGES 3 & 4: PHOTOREALISTIC EARTH & MOON SYSTEM (0.12 -> 0.50)
      // Realistic Oceans, Continents, Multi-layer Clouds with Shadows, Rayleigh Atmosphere
      // =========================================================
      if (p >= 0.12 && p < 0.52) {
        const earthProgress = range(p, 0.14, 0.44, 0, 1);
        const earthAlpha =
          p < 0.2
            ? range(p, 0.12, 0.2, 0, 1)
            : p > 0.38
            ? range(p, 0.38, 0.48, 1, 0)
            : 1.0;

        const earthRadius = range(earthProgress, 0, 1, Math.min(width, height) * 0.26, 8);
        const earthCenterX = range(earthProgress, 0, 1, cx - width * 0.08, cx - width * 0.12);
        const earthCenterY = range(earthProgress, 0, 1, cy + height * 0.04, cy);

        ctx.save();
        ctx.globalAlpha = earthAlpha;

        // 1. Rayleigh Atmospheric Outer Scattering Limb Glow (Sunlit crescent arc)
        const atmosGlow = ctx.createRadialGradient(
          earthCenterX - earthRadius * 0.3,
          earthCenterY - earthRadius * 0.3,
          earthRadius * 0.95,
          earthCenterX,
          earthCenterY,
          earthRadius * 1.3
        );
        atmosGlow.addColorStop(0, 'rgba(95, 185, 255, 0.55)');
        atmosGlow.addColorStop(0.35, 'rgba(45, 135, 245, 0.28)');
        atmosGlow.addColorStop(0.7, 'rgba(15, 75, 195, 0.08)');
        atmosGlow.addColorStop(1, 'rgba(0, 40, 140, 0)');
        ctx.fillStyle = atmosGlow;
        ctx.beginPath();
        ctx.arc(earthCenterX, earthCenterY, earthRadius * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // 2. Spherical clipping for Earth disc
        ctx.save();
        ctx.beginPath();
        ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
        ctx.clip();

        // 2a. Earth Surface (Exact Photographic 3D Model Asset)
        ctx.drawImage(
          textures.earthSurface,
          earthCenterX - earthRadius,
          earthCenterY - earthRadius,
          earthRadius * 2,
          earthRadius * 2
        );

        // 2b. Subtle Specular Sun Glint
        const glintX = earthCenterX - earthRadius * 0.35;
        const glintY = earthCenterY - earthRadius * 0.35;
        const glintGrad = ctx.createRadialGradient(glintX, glintY, 0, glintX, glintY, earthRadius * 0.4);
        glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        glintGrad.addColorStop(0.4, 'rgba(180, 225, 255, 0.08)');
        glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glintGrad;
        ctx.beginPath();
        ctx.arc(glintX, glintY, earthRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // 2c. Directional Day/Night Terminator Shading (Matches Sun Angle)
        const earthTerminator = ctx.createLinearGradient(
          earthCenterX - earthRadius * 0.8,
          earthCenterY - earthRadius * 0.8,
          earthCenterX + earthRadius * 0.85,
          earthCenterY + earthRadius * 0.85
        );
        earthTerminator.addColorStop(0, 'rgba(255, 255, 255, 0)');
        earthTerminator.addColorStop(0.45, 'rgba(0, 0, 0, 0)');
        earthTerminator.addColorStop(0.6, 'rgba(10, 18, 35, 0.55)');   // Dusk/Dawn twilight line
        earthTerminator.addColorStop(0.78, 'rgba(3, 6, 15, 0.92)');    // Night hemisphere
        earthTerminator.addColorStop(1, 'rgba(1, 2, 6, 0.98)');
        ctx.fillStyle = earthTerminator;
        ctx.fillRect(
          earthCenterX - earthRadius,
          earthCenterY - earthRadius,
          earthRadius * 2,
          earthRadius * 2
        );

        // 2f. Golden Night City Lights (Visible on unlit hemisphere)
        if (earthRadius > 22) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.globalAlpha = 0.75;
          ctx.drawImage(
            textures.earthNightLights,
            earthCenterX - earthRadius,
            earthCenterY - earthRadius,
            earthRadius * 2,
            earthRadius * 2
          );
          ctx.restore();
        }

        // 2g. Atmospheric Blue Limb Scattering inside disc
        const innerAtmos = ctx.createRadialGradient(
          earthCenterX - earthRadius * 0.25,
          earthCenterY - earthRadius * 0.25,
          earthRadius * 0.5,
          earthCenterX,
          earthCenterY,
          earthRadius
        );
        innerAtmos.addColorStop(0, 'rgba(0, 0, 0, 0)');
        innerAtmos.addColorStop(0.85, 'rgba(60, 160, 255, 0.12)');
        innerAtmos.addColorStop(1, 'rgba(120, 200, 255, 0.38)');
        ctx.fillStyle = innerAtmos;
        ctx.beginPath();
        ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore(); // Restore clip

        // 3. Orbiting Photorealistic Moon in Earth System (Stage 4)
        if (p >= 0.22 && p < 0.42) {
          const orbitProgress = range(p, 0.22, 0.42, 0, 1);
          const orbitRadiusX = earthRadius * 3.4;
          const orbitRadiusY = earthRadius * 1.6;

          // Fine astronomical orbital ellipse
          ctx.strokeStyle = `rgba(180, 210, 245, ${0.14 * earthAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.ellipse(
            earthCenterX,
            earthCenterY,
            orbitRadiusX,
            orbitRadiusY,
            -0.15,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.setLineDash([]);

          // Orbiting Moon Node
          const orbitAngle = orbitProgress * Math.PI * 1.5 + 0.4;
          const mx = earthCenterX + Math.cos(orbitAngle) * orbitRadiusX;
          const my = earthCenterY + Math.sin(orbitAngle) * orbitRadiusY;
          const mr = Math.max(2.4, earthRadius * 0.27);

          ctx.save();
          ctx.beginPath();
          ctx.arc(mx, my, mr, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(textures.moon, mx - mr, my - mr, mr * 2, mr * 2);

          // Matching sun terminator on orbiting moon
          const mTerm = ctx.createLinearGradient(
            mx - mr * 0.7,
            my - mr * 0.7,
            mx + mr * 0.8,
            my + mr * 0.8
          );
          mTerm.addColorStop(0, 'rgba(0, 0, 0, 0)');
          mTerm.addColorStop(0.5, 'rgba(5, 8, 16, 0.5)');
          mTerm.addColorStop(0.85, 'rgba(2, 3, 8, 0.95)');
          ctx.fillStyle = mTerm;
          ctx.fillRect(mx - mr, my - mr, mr * 2, mr * 2);
          ctx.restore();
        }

        ctx.restore();
      }

      // =========================================================
      // 4. STAGES 5 & 6: PHOTOREALISTIC SOLAR SYSTEM (0.36 -> 0.74)
      // Physical Sun, Coronal Streamers, Sun-illuminated Planets, 3D Saturn Ring Projections
      // =========================================================
      if (p >= 0.36 && p < 0.74) {
        const solarProgress = range(p, 0.38, 0.68, 0, 1);
        const solarAlpha =
          p < 0.44
            ? range(p, 0.36, 0.44, 0, 1)
            : p > 0.6
            ? range(p, 0.6, 0.7, 1, 0)
            : 1.0;

        const solarScale = range(solarProgress, 0, 1, 1.0, 0.08);
        const maxOrbit = Math.min(width, height) * 0.46 * solarScale;

        ctx.save();
        ctx.globalAlpha = solarAlpha;

        // 1. Central Physical Sun (White-hot core, chromosphere limb darkening, dynamic corona streamers)
        const sunRadius = Math.max(3.5, 24 * solarScale);

        // Dynamic Coronal Streamers
        const coronaGrad = ctx.createRadialGradient(
          cx,
          cy,
          sunRadius * 0.8,
          cx,
          cy,
          sunRadius * 4.8
        );
        coronaGrad.addColorStop(0, 'rgba(255, 250, 235, 0.9)');
        coronaGrad.addColorStop(0.2, 'rgba(255, 220, 150, 0.55)');
        coronaGrad.addColorStop(0.5, 'rgba(245, 160, 70, 0.2)');
        coronaGrad.addColorStop(0.8, 'rgba(230, 110, 30, 0.05)');
        coronaGrad.addColorStop(1, 'rgba(200, 80, 20, 0)');
        ctx.fillStyle = coronaGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, sunRadius * 4.8, 0, Math.PI * 2);
        ctx.fill();

        // Photosphere Core with Chromospheric Limb Darkening
        const photoGrad = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          sunRadius
        );
        photoGrad.addColorStop(0, '#FFFFFF');
        photoGrad.addColorStop(0.7, '#FFF6DE');
        photoGrad.addColorStop(0.9, '#FCD34D');
        photoGrad.addColorStop(1, '#F97316');
        ctx.fillStyle = photoGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Planetary Orbits & Photorealistic Planets
        const planetsConfig = [
          { name: 'Mercury', dist: 0.16, size: 2.4, texture: 'mercury', angle: 0.9 },
          { name: 'Venus', dist: 0.25, size: 3.8, texture: 'venus', angle: 2.3 },
          { name: 'Earth', dist: 0.36, size: 4.2, texture: 'earth', angle: 4.2 },
          { name: 'Mars', dist: 0.48, size: 3.0, texture: 'mars', angle: 1.2 },
          { name: 'Jupiter', dist: 0.66, size: 8.5, texture: 'jupiter', angle: 5.4 },
          { name: 'Saturn', dist: 0.82, size: 7.2, texture: 'saturn', angle: 3.5, rings: true },
          { name: 'Uranus', dist: 0.93, size: 5.2, texture: 'uranus', angle: 0.4 },
          { name: 'Neptune', dist: 1.02, size: 5.0, texture: 'neptune', angle: 1.9 },
        ];

        planetsConfig.forEach((pl) => {
          const orbitR = pl.dist * maxOrbit;

          // Realistic Keplarian orbit line
          ctx.strokeStyle = 'rgba(215, 230, 255, 0.1)';
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.ellipse(cx, cy, orbitR, orbitR * 0.76, 0.2, 0, Math.PI * 2);
          ctx.stroke();

          // Planet position
          const px = cx + Math.cos(pl.angle) * orbitR;
          const py = cy + Math.sin(pl.angle) * (orbitR * 0.76);
          const pr = Math.max(1.2, pl.size * solarScale);

          // Vector from Sun to Planet for directional physical lighting
          const dx = px - cx;
          const dy = py - cy;
          const sunDist = Math.sqrt(dx * dx + dy * dy);
          const nx = sunDist > 0 ? dx / sunDist : 1;
          const ny = sunDist > 0 ? dy / sunDist : 0;

          // Render Individual Photorealistic Planet
          ctx.save();

          // Special Saturn 3D Ring System Rendering
          if (pl.rings && pr > 2.5) {
            const ringOuterR = pr * 2.4;
            const ringTilt = 0.45;

            // 1. Back half of Saturn's ring (behind planet body)
            ctx.save();
            ctx.beginPath();
            ctx.rect(px - ringOuterR * 1.5, py - ringOuterR * 1.5, ringOuterR * 3, ringOuterR * 1.5);
            ctx.clip();
            ctx.drawImage(
              textures.saturnRings,
              px - ringOuterR,
              py - ringOuterR * ringTilt,
              ringOuterR * 2,
              ringOuterR * 2 * ringTilt
            );
            // Planet shadow cast onto rear rings
            const ringShadow = ctx.createLinearGradient(
              px - nx * pr,
              py - ny * pr,
              px + nx * ringOuterR * 1.2,
              py + ny * ringOuterR * 1.2
            );
            ringShadow.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
            ringShadow.addColorStop(0.7, 'rgba(0, 0, 0, 0.8)');
            ringShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = ringShadow;
            ctx.fillRect(px - ringOuterR, py - ringOuterR * ringTilt, ringOuterR * 2, ringOuterR * 2 * ringTilt);
            ctx.restore();

            // 2. Saturn Planet Body
            ctx.save();
            ctx.beginPath();
            ctx.arc(px, py, pr, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(textures.saturn, px - pr, py - pr, pr * 2, pr * 2);
            // Ring shadow cast across planet equator
            ctx.fillStyle = 'rgba(25, 18, 10, 0.7)';
            ctx.fillRect(px - pr, py - pr * 0.12, pr * 2, pr * 0.24);
            // Sun terminator pointing towards central Sun
            const sTerm = ctx.createLinearGradient(
              px - nx * pr,
              py - ny * pr,
              px + nx * pr,
              py + ny * pr
            );
            sTerm.addColorStop(0, 'rgba(0, 0, 0, 0)');
            sTerm.addColorStop(0.5, 'rgba(10, 7, 5, 0.45)');
            sTerm.addColorStop(0.9, 'rgba(2, 1, 1, 0.95)');
            ctx.fillStyle = sTerm;
            ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);
            ctx.restore();

            // 3. Front half of Saturn's ring (in front of planet body)
            ctx.save();
            ctx.beginPath();
            ctx.rect(px - ringOuterR * 1.5, py, ringOuterR * 3, ringOuterR * 1.5);
            ctx.clip();
            ctx.drawImage(
              textures.saturnRings,
              px - ringOuterR,
              py - ringOuterR * ringTilt,
              ringOuterR * 2,
              ringOuterR * 2 * ringTilt
            );
            ctx.restore();
          } else {
            // General Planet Spherical Rendering with Physically Accurate Lighting
            ctx.beginPath();
            ctx.arc(px, py, pr, 0, Math.PI * 2);
            ctx.clip();

            if (pl.texture === 'jupiter') {
              ctx.drawImage(textures.jupiter, px - pr, py - pr, pr * 2, pr * 2);
            } else if (pl.texture === 'mars') {
              ctx.drawImage(textures.mars, px - pr, py - pr, pr * 2, pr * 2);
            } else if (pl.texture === 'earth') {
              ctx.drawImage(textures.earthSurface, px - pr, py - pr, pr * 2, pr * 2);
            } else if (pl.texture === 'venus') {
              ctx.drawImage(textures.venus, px - pr, py - pr, pr * 2, pr * 2);
            } else if (pl.texture === 'mercury') {
              ctx.drawImage(textures.mercury, px - pr, py - pr, pr * 2, pr * 2);
            } else if (pl.texture === 'uranus') {
              ctx.drawImage(textures.uranus, px - pr, py - pr, pr * 2, pr * 2);
            } else if (pl.texture === 'neptune') {
              ctx.drawImage(textures.neptune, px - pr, py - pr, pr * 2, pr * 2);
            }

            // Directional Sun lighting (illuminated face points to central Sun)
            const pTerm = ctx.createLinearGradient(
              px - nx * pr,
              py - ny * pr,
              px + nx * pr,
              py + ny * pr
            );
            pTerm.addColorStop(0, 'rgba(0, 0, 0, 0)');
            pTerm.addColorStop(0.48, 'rgba(0, 0, 0, 0)');
            pTerm.addColorStop(0.65, 'rgba(10, 15, 25, 0.6)');
            pTerm.addColorStop(0.92, 'rgba(2, 3, 8, 0.98)');
            ctx.fillStyle = pTerm;
            ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);
          }

          ctx.restore();
        });

        ctx.restore();
      }

      // =========================================================
      // 5. STAGES 7 & 8: PHOTOREALISTIC MILKY WAY GALAXY (0.58 -> 0.92)
      // Logarithmic Spiral Arms, Golden Core Bulge, Pink HII Nurseries, Dark Interstellar Dust Lanes
      // =========================================================
      if (p >= 0.58 && p < 0.92) {
        const galaxyProgress = range(p, 0.62, 0.86, 0, 1);
        const galaxyAlpha =
          p < 0.68
            ? range(p, 0.58, 0.68, 0, 1)
            : p > 0.82
            ? range(p, 0.82, 0.9, 1, 0.2)
            : 1.0;

        const galaxyScale = range(galaxyProgress, 0, 1, 1.35, 0.25);
        const galaxyTilt = 0.52; // Realistic astronomical viewing angle

        ctx.save();
        ctx.globalAlpha = galaxyAlpha;

        // 1. Central Supermassive Galactic Core Bulge (Warm Golden Population II Stars)
        const coreRadius = Math.min(width, height) * 0.16 * galaxyScale;
        const coreGrad = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          coreRadius * 2.4
        );
        coreGrad.addColorStop(0, 'rgba(255, 252, 240, 0.98)');
        coreGrad.addColorStop(0.18, 'rgba(255, 235, 190, 0.85)');
        coreGrad.addColorStop(0.45, 'rgba(220, 185, 140, 0.45)');
        coreGrad.addColorStop(0.75, 'rgba(140, 175, 235, 0.15)');
        coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, coreRadius * 2.4, 0, Math.PI * 2);
        ctx.fill();

        // 2. Spiral Arm Stars, OB Clusters, HII Regions & Dark Dust Lanes
        const armRotation = time * 0.00008;
        const maxArmR = Math.min(width, height) * 0.48;

        galaxyParticles.forEach((gp) => {
          gp.angleOffset += gp.speed * delta;
          const curR = gp.distRatio * maxArmR * galaxyScale;
          // Logarithmic spiral math: θ = a * ln(r)
          const spiralAngle = gp.arm + Math.log(gp.distRatio + 0.1) * 2.8 + gp.angleOffset + armRotation;

          const gx = cx + Math.cos(spiralAngle) * curR;
          const gy = cy + Math.sin(spiralAngle) * (curR * galaxyTilt);

          ctx.beginPath();
          ctx.arc(gx, gy, gp.size * galaxyScale, 0, Math.PI * 2);
          ctx.fillStyle = `${gp.color}${gp.alpha * galaxyAlpha})`;
          ctx.fill();
        });

        // 3. Precise Location of the Solar System in the Orion Spur (Subtle pinpoint starlight marker)
        if (galaxyProgress < 0.6) {
          const solarArmAngle = 2.1 + armRotation;
          const solarArmDist = Math.min(width, height) * 0.27 * galaxyScale;
          const sx = cx + Math.cos(solarArmAngle) * solarArmDist;
          const sy = cy + Math.sin(solarArmAngle) * (solarArmDist * galaxyTilt);

          ctx.save();
          ctx.beginPath();
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = 'rgba(220, 240, 255, 1)';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        }

        ctx.restore();
      }

      // =========================================================
      // 6. STAGES 9 & 10: PHOTOREALISTIC DEEP UNIVERSE (0.76 -> 1.00)
      // Hubble/JWST Deep Field Galaxies, Redshifted Cosmological Morphology, Cosmic Web
      // =========================================================
      if (p >= 0.76) {
        const universeProgress = range(p, 0.8, 1.0, 0, 1);
        const universeAlpha = range(p, 0.76, 0.88, 0, 1);

        ctx.save();
        ctx.globalAlpha = universeAlpha;

        // 1. Cosmic Web Filamentary Structures (Large-scale matter distribution)
        ctx.strokeStyle = 'rgba(140, 185, 245, 0.04)';
        ctx.lineWidth = 0.65;
        for (let i = 0; i < distantGalaxies.length - 1; i += 2) {
          const g1 = distantGalaxies[i];
          const g2 = distantGalaxies[i + 1];
          if (g1 && g2) {
            ctx.beginPath();
            ctx.moveTo(g1.x, g1.y);
            ctx.quadraticCurveTo(
              (g1.x + g2.x) * 0.5 + (Math.sin(i) * 30),
              (g1.y + g2.y) * 0.5 + (Math.cos(i) * 30),
              g2.x,
              g2.y
            );
            ctx.stroke();
          }
        }

        // 2. Morphologically Accurate Distant Galaxies (Spirals, Ellipticals, Edge-On Disks with Dust Lanes)
        distantGalaxies.forEach((g) => {
          const gx = cx + (g.x - cx) * (1.0 + universeProgress * 0.25);
          const gy = cy + (g.y - cy) * (1.0 + universeProgress * 0.25);

          ctx.save();
          ctx.translate(gx, gy);
          ctx.rotate(g.angle);

          // Galaxy Outer Halo & Disk
          const diskGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, g.rx);
          diskGrad.addColorStop(0, `rgba(${g.coreColor}, ${g.alpha * 0.95})`);
          diskGrad.addColorStop(0.35, `rgba(${g.diskColor}, ${g.alpha * 0.5})`);
          diskGrad.addColorStop(0.8, `rgba(${g.diskColor}, ${g.alpha * 0.15})`);
          diskGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = diskGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, g.rx, g.ry, 0, 0, Math.PI * 2);
          ctx.fill();

          // Dark Dust Lane across Edge-on and Spiral Disks
          if (g.dustLane) {
            ctx.fillStyle = `rgba(15, 10, 8, ${g.alpha * 0.75})`;
            ctx.fillRect(-g.rx * 0.85, -g.ry * 0.12, g.rx * 1.7, g.ry * 0.24);
          }

          // Brilliant Core Nucleus
          ctx.fillStyle = `rgba(255, 255, 255, ${g.alpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(1, g.rx * 0.12), 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, scrollProgress]);

  if (!isOpen) return null;

  const isYouAreVisible = scrollProgress >= 0.84;
  const isMyUniverseVisible = scrollProgress >= 0.89;
  const isFinalCalmAnchored = scrollProgress >= 0.93;

  return (
    <motion.div
      id="moon-universe-universe-experience"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 w-full h-[100svh] bg-[#000003] text-[#EAEFF8] flex flex-col select-none overflow-hidden"
      style={{ zIndex: 100 }}
      role="dialog"
      aria-modal="true"
      aria-label="Universe Secret: You Are My Universe"
    >
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />

      {/* Top Fixed Header: Subtle Return Button */}
      <header className="fixed top-0 left-0 right-0 w-full flex items-center justify-between px-5 sm:px-10 pt-5 sm:pt-7 z-40 pointer-events-none">
        <button
          type="button"
          onClick={onClose}
          aria-label="Return to our story"
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-white/[0.08] hover:bg-white/[0.16] active:bg-white/[0.22] transition-all duration-200 text-white/90 hover:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md shadow-lg shadow-black/60"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-200" />
          <span className="font-body text-xs uppercase tracking-[0.24em] font-semibold">
            Return to our story
          </span>
        </button>

        {/* Secret Discovery Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-white/50 font-body text-[11px] uppercase tracking-[0.28em]">
          <Sparkles className="w-3.5 h-3.5 text-blue-200/80" />
          <span>Hidden Universe</span>
        </div>
      </header>

      {/* Primary Scrollable Viewport Track */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative w-full h-full overflow-y-auto overflow-x-hidden z-30"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Track Height Container (1250vh for slow, cinematic zoom pacing) */}
        <div className="w-full h-[1250vh] relative">

          {/* Sticky Viewport Stage (100svh) */}
          <div className="sticky top-0 h-[100svh] w-full flex flex-col items-center justify-between px-4 sm:px-8 text-center pt-20 pb-12 pointer-events-none">

            {/* Top Stage Indicator */}
            <div className="w-full flex justify-center items-center">
              <div
                className={`transition-opacity duration-700 font-body text-[10px] sm:text-xs tracking-[0.28em] uppercase ${
                  scrollProgress < 0.08
                    ? 'text-white/60 opacity-100'
                    : 'text-white/30 opacity-40'
                }`}
              >
                {scrollProgress < 0.12 ? (
                  <span>Scroll downward to travel backward through space</span>
                ) : scrollProgress < 0.8 ? (
                  <span className="flex items-center gap-1.5 justify-center">
                    <Orbit className="w-3 h-3 text-blue-300/70 animate-spin" style={{ animationDuration: '14s' }} />
                    Cosmic Zoom
                  </span>
                ) : (
                  <span>Immense Universe</span>
                )}
              </div>
            </div>

            {/* Center Stage: Final Message Typography (0.84 -> 1.00) */}
            <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center my-auto min-h-[280px]">
              
              {/* Dynamic Staged Revelation */}
              <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-4 max-w-4xl mx-auto w-full px-4">
                
                {/* 1. "YOU ARE" (Appears at 0.84+) */}
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{
                    opacity: isYouAreVisible ? 1 : 0,
                    y: isYouAreVisible ? 0 : 20,
                    filter: isYouAreVisible ? 'blur(0px)' : 'blur(8px)',
                  }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-center"
                >
                  <h1
                    id="universe-message-you-are"
                    className="font-editorial text-[clamp(2.5rem,7.5vw,5.5rem)] font-bold text-white uppercase tracking-[0.16em] sm:tracking-[0.22em] leading-tight select-none"
                    style={{
                      textShadow:
                        '0 0 35px rgba(220, 235, 255, 0.9), 0 0 80px rgba(180, 215, 255, 0.5)',
                    }}
                  >
                    YOU ARE
                  </h1>
                </motion.div>

                {/* 2. "MY UNIVERSE." (Appears at 0.89+) */}
                <motion.div
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{
                    opacity: isMyUniverseVisible ? 1 : 0,
                    y: isMyUniverseVisible ? 0 : 20,
                    filter: isMyUniverseVisible ? 'blur(0px)' : 'blur(8px)',
                  }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-center"
                >
                  <h1
                    id="universe-message-my-universe"
                    className="font-editorial text-[clamp(2.5rem,7.5vw,5.5rem)] font-bold text-blue-50 uppercase tracking-[0.16em] sm:tracking-[0.22em] leading-tight select-none"
                    style={{
                      textShadow:
                        '0 0 45px rgba(255, 255, 255, 0.95), 0 0 95px rgba(180, 215, 255, 0.6)',
                    }}
                  >
                    MY UNIVERSE.
                  </h1>
                </motion.div>

                {/* Ambient Starlight Bloom Aura */}
                <motion.div
                  animate={{
                    opacity: isFinalCalmAnchored ? [0.35, 0.6, 0.35] : 0,
                    scale: isFinalCalmAnchored ? [1, 1.08, 1] : 0.9,
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[radial-gradient(circle,_rgba(220,240,255,0.22)_0%,_rgba(150,195,255,0.06)_50%,_transparent_75%)] blur-2xl pointer-events-none mt-2"
                />
              </div>

            </div>

            {/* Bottom Controls / Return Button when universe is reached */}
            <div className="w-full flex flex-col items-center justify-center flex-shrink-0 z-30 pb-4 pointer-events-auto">
              {scrollProgress >= 0.92 ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="pt-2"
                >
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Return to our story from bottom"
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/20 bg-white/[0.08] hover:bg-white/[0.18] active:bg-white/[0.24] transition-all duration-200 text-white/90 hover:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md shadow-lg shadow-black/60"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-blue-200" />
                    <span className="font-body text-xs uppercase tracking-[0.24em] font-semibold">
                      Return to our story
                    </span>
                  </button>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-[10px] sm:text-xs text-white/40 uppercase tracking-[0.24em] pointer-events-none">
                  <span>Scroll to travel deeper into space</span>
                  <div className="w-[1px] h-5 bg-gradient-to-b from-white/30 to-transparent" />
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
};
