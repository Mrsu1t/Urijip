/**
 * Ultra-Realistic Photorealistic Celestial Rendering Engine for Phase 10
 * Astronomical, high-end VFX-style planetary surfaces, atmospheric scattering,
 * 3D directional lighting, ring projections, solar corona, and cosmic deep-field galaxies.
 */

// ============================================================================
// PROCEDURAL FRACTAL NOISE & RANDOMNESS ENGINE
// ============================================================================

/**
 * 2D Seeded Pseudo-Random Hash
 */
function hash2D(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

/**
 * Smooth 2D Value Noise with Hermite cubic interpolation
 */
function valueNoise2D(x: number, y: number): number {
  const iX = Math.floor(x);
  const iY = Math.floor(y);
  const fX = x - iX;
  const fY = y - iY;

  // Cubic Hermite smoothstep curve
  const u = fX * fX * (3.0 - 2.0 * fX);
  const v = fY * fY * (3.0 - 2.0 * fY);

  const a = hash2D(iX, iY);
  const b = hash2D(iX + 1, iY);
  const c = hash2D(iX, iY + 1);
  const d = hash2D(iX + 1, iY + 1);

  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/**
 * Multi-octave Fractal Brownian Motion (fBm)
 */
function fbm2D(
  x: number,
  y: number,
  octaves: number = 5,
  lacunarity: number = 2.0,
  gain: number = 0.5
): number {
  let total = 0;
  let amplitude = 1.0;
  let frequency = 1.0;
  let maxAmp = 0;

  for (let i = 0; i < octaves; i++) {
    total += valueNoise2D(x * frequency, y * frequency) * amplitude;
    maxAmp += amplitude;
    frequency *= lacunarity;
    amplitude *= gain;
  }

  return total / maxAmp;
}

/**
 * Turbulent noise for realistic atmospheric eddies and clouds
 */
function turbulence2D(x: number, y: number, octaves: number = 4): number {
  let total = 0;
  let amplitude = 1.0;
  let frequency = 1.0;
  let maxAmp = 0;

  for (let i = 0; i < octaves; i++) {
    total += Math.abs(valueNoise2D(x * frequency, y * frequency) - 0.5) * 2.0 * amplitude;
    maxAmp += amplitude;
    frequency *= 2.0;
    amplitude *= 0.5;
  }

  return total / maxAmp;
}

// ============================================================================
// DATA TYPES
// ============================================================================

export interface GalaxyParticleData {
  arm: number;
  distRatio: number;
  angleOffset: number;
  speed: number;
  size: number;
  alpha: number;
  type: 'core' | 'blue_star' | 'dust' | 'hii_region';
  color: string;
}

export interface DistantGalaxyData {
  x: number;
  y: number;
  rx: number;
  ry: number;
  angle: number;
  morphology: 'spiral' | 'elliptical' | 'edge_on' | 'barred';
  alpha: number;
  coreColor: string;
  diskColor: string;
  dustLane: boolean;
  redshift: number;
}

export interface CelestialTextures {
  moon: HTMLCanvasElement;
  earthSurface: HTMLCanvasElement;
  earthClouds: HTMLCanvasElement;
  earthNightLights: HTMLCanvasElement;
  mercury: HTMLCanvasElement;
  venus: HTMLCanvasElement;
  mars: HTMLCanvasElement;
  jupiter: HTMLCanvasElement;
  saturn: HTMLCanvasElement;
  saturnRings: HTMLCanvasElement;
  uranus: HTMLCanvasElement;
  neptune: HTMLCanvasElement;
}

// ============================================================================
// 1. PHOTOREALISTIC MOON (Exact Photographic Reference Asset & Dynamic Procedural Blend)
// ============================================================================
let cachedMoonImage: HTMLImageElement | null = null;

export function getMoonImage(): HTMLImageElement {
  if (!cachedMoonImage) {
    cachedMoonImage = new Image();
    cachedMoonImage.src = '/assets/moon.jpg';
  }
  return cachedMoonImage;
}

export function createMoonTexture(size: number = 512): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const moonImg = getMoonImage();

  // If image is already loaded, draw photographic texture
  if (moonImg.complete && moonImg.naturalWidth > 0) {
    ctx.drawImage(moonImg, 0, 0, size, size);
    return canvas;
  }

  // Base procedural photorealistic terrain as immediate raster
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Major Basaltic Maria Basin Centers [xNorm, yNorm, radiusNorm, darknessWeight]
  const mariaBasins = [
    { x: 0.32, y: 0.36, r: 0.28, w: 0.68 },
    { x: 0.44, y: 0.28, r: 0.16, w: 0.74 },
    { x: 0.60, y: 0.32, r: 0.14, w: 0.72 },
    { x: 0.66, y: 0.44, r: 0.15, w: 0.70 },
    { x: 0.72, y: 0.56, r: 0.13, w: 0.64 },
    { x: 0.38, y: 0.62, r: 0.15, w: 0.62 },
    { x: 0.80, y: 0.38, r: 0.08, w: 0.80 },
    { x: 0.62, y: 0.66, r: 0.09, w: 0.62 },
  ];

  for (let py = 0; py < size; py++) {
    const ny = py / size;
    for (let px = 0; px < size; px++) {
      const nx = px / size;
      const idx = (py * size + px) * 4;

      const highlandNoise = fbm2D(nx * 8.5, ny * 8.5, 5, 2.1, 0.52);
      const microGrain = (hash2D(px * 1.3, py * 1.7) - 0.5) * 16;

      let mariaFactor = 0;
      for (let m = 0; m < mariaBasins.length; m++) {
        const mb = mariaBasins[m];
        const dx = nx - mb.x;
        const dy = ny - mb.y;
        const edgeWobble = (fbm2D(nx * 14 + m, ny * 14 + m, 3, 2.0, 0.5) - 0.5) * 0.12;
        const dist = Math.sqrt(dx * dx + dy * dy) + edgeWobble;
        if (dist < mb.r) {
          const falloff = 1.0 - dist / mb.r;
          const basinDarkness = Math.pow(falloff, 1.4) * mb.w;
          if (basinDarkness > mariaFactor) mariaFactor = basinDarkness;
        }
      }

      const highlandVal = 185 + highlandNoise * 60;
      const mariaVal = 62 + highlandNoise * 35;
      const finalVal = Math.min(255, Math.max(15, highlandVal * (1 - mariaFactor) + mariaVal * mariaFactor + microGrain));

      data[idx] = Math.round(finalVal * 0.98);
      data[idx + 1] = Math.round(finalVal * 1.0);
      data[idx + 2] = Math.round(finalVal * 1.03);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Hook image onload for instant updates
  moonImg.onload = () => {
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(moonImg, 0, 0, size, size);
  };

  return canvas;
}

// ============================================================================
// 2. PHOTOREALISTIC EARTH (Exact Satellite Reference Asset & Fallback)
// ============================================================================
let cachedEarthImage: HTMLImageElement | null = null;

export function getEarthImage(): HTMLImageElement {
  if (!cachedEarthImage) {
    cachedEarthImage = new Image();
    cachedEarthImage.src = '/assets/earth.jpg';
  }
  return cachedEarthImage;
}

export function createEarthTextures(size: number = 512): {
  surface: HTMLCanvasElement;
  clouds: HTMLCanvasElement;
  nightLights: HTMLCanvasElement;
} {
  // 1. Earth Surface (Oceans + Satellite-accurate Landmasses + Mountains + Ice Caps)
  const surface = document.createElement('canvas');
  surface.width = size;
  surface.height = size;
  const sCtx = surface.getContext('2d');

  const earthImg = getEarthImage();

  const renderProceduralSurface = () => {
    if (!sCtx) return;
    // Ocean Base Gradient: Deep Abyssal Blue with Bathymetric Light Falloff
    const oceanGrad = sCtx.createRadialGradient(
      size * 0.5,
      size * 0.5,
      0,
      size * 0.5,
      size * 0.5,
      size * 0.5
    );
    oceanGrad.addColorStop(0, '#0F386E');
    oceanGrad.addColorStop(0.55, '#0B2956');
    oceanGrad.addColorStop(0.85, '#071D3E');
    oceanGrad.addColorStop(1, '#030E22');
    sCtx.fillStyle = oceanGrad;
    sCtx.fillRect(0, 0, size, size);

    // Continental Shelf Turquoise Coastal Shallows
    sCtx.strokeStyle = 'rgba(28, 142, 182, 0.45)';
    sCtx.lineWidth = size * 0.024;
    sCtx.lineCap = 'round';
    sCtx.lineJoin = 'round';

    // Landmass 1: Africa & Mediterranean Europe
    sCtx.fillStyle = '#3E5C38';
    sCtx.beginPath();
    sCtx.moveTo(size * 0.47, size * 0.24);
    sCtx.bezierCurveTo(size * 0.54, size * 0.22, size * 0.62, size * 0.30, size * 0.58, size * 0.40);
    sCtx.bezierCurveTo(size * 0.66, size * 0.52, size * 0.60, size * 0.72, size * 0.52, size * 0.78);
    sCtx.bezierCurveTo(size * 0.44, size * 0.70, size * 0.38, size * 0.56, size * 0.40, size * 0.42);
    sCtx.closePath();
    sCtx.fill();
    sCtx.stroke();

    // Sahara, Arabian & Namib Desert Biomes
    sCtx.fillStyle = '#C89E5B';
    sCtx.beginPath();
    sCtx.ellipse(size * 0.50, size * 0.44, size * 0.095, size * 0.055, -0.08, 0, Math.PI * 2);
    sCtx.fill();

    // Congo Rainforest Basin
    sCtx.fillStyle = '#1D3B1C';
    sCtx.beginPath();
    sCtx.ellipse(size * 0.51, size * 0.57, size * 0.05, size * 0.045, 0.1, 0, Math.PI * 2);
    sCtx.fill();

    // Madagascar Island
    sCtx.fillStyle = '#344E2E';
    sCtx.beginPath();
    sCtx.ellipse(size * 0.64, size * 0.66, size * 0.018, size * 0.038, 0.3, 0, Math.PI * 2);
    sCtx.fill();

    // Landmass 2: Eurasia & Asian Continent
    sCtx.fillStyle = '#344E2E';
    sCtx.beginPath();
    sCtx.moveTo(size * 0.54, size * 0.22);
    sCtx.bezierCurveTo(size * 0.68, size * 0.17, size * 0.86, size * 0.26, size * 0.82, size * 0.42);
    sCtx.bezierCurveTo(size * 0.78, size * 0.54, size * 0.68, size * 0.50, size * 0.60, size * 0.36);
    sCtx.closePath();
    sCtx.fill();
    sCtx.stroke();

    // Gobi / Central Asian Deserts
    sCtx.fillStyle = '#B88F52';
    sCtx.beginPath();
    sCtx.ellipse(size * 0.69, size * 0.32, size * 0.07, size * 0.035, 0.15, 0, Math.PI * 2);
    sCtx.fill();

    // Himalayan Mountain Ridge
    sCtx.strokeStyle = 'rgba(235, 245, 255, 0.85)';
    sCtx.lineWidth = size * 0.012;
    sCtx.beginPath();
    sCtx.moveTo(size * 0.62, size * 0.38);
    sCtx.quadraticCurveTo(size * 0.68, size * 0.36, size * 0.74, size * 0.39);
    sCtx.stroke();

    // Landmass 3: Americas
    sCtx.fillStyle = '#31492B';
    sCtx.beginPath();
    sCtx.moveTo(size * 0.18, size * 0.20);
    sCtx.bezierCurveTo(size * 0.28, size * 0.18, size * 0.33, size * 0.34, size * 0.26, size * 0.44);
    sCtx.bezierCurveTo(size * 0.22, size * 0.48, size * 0.16, size * 0.40, size * 0.14, size * 0.30);
    sCtx.closePath();
    sCtx.fill();
    sCtx.stroke();

    // Rocky Mountains
    sCtx.fillStyle = '#9C7A4A';
    sCtx.beginPath();
    sCtx.ellipse(size * 0.20, size * 0.32, size * 0.03, size * 0.06, 0.25, 0, Math.PI * 2);
    sCtx.fill();

    // South America
    sCtx.fillStyle = '#2A4226';
    sCtx.beginPath();
    sCtx.moveTo(size * 0.24, size * 0.48);
    sCtx.bezierCurveTo(size * 0.35, size * 0.52, size * 0.33, size * 0.70, size * 0.26, size * 0.80);
    sCtx.bezierCurveTo(size * 0.20, size * 0.74, size * 0.18, size * 0.58, size * 0.24, size * 0.48);
    sCtx.closePath();
    sCtx.fill();
    sCtx.stroke();

    // Amazon Basin
    sCtx.fillStyle = '#163318';
    sCtx.beginPath();
    sCtx.ellipse(size * 0.27, size * 0.56, size * 0.055, size * 0.04, 0.1, 0, Math.PI * 2);
    sCtx.fill();

    // Landmass 4: Australia / Oceania
    sCtx.fillStyle = '#945832';
    sCtx.beginPath();
    sCtx.ellipse(size * 0.80, size * 0.68, size * 0.058, size * 0.042, -0.1, 0, Math.PI * 2);
    sCtx.fill();

    // Polar Ice Caps
    sCtx.fillStyle = '#EEF6FC';
    sCtx.beginPath();
    sCtx.ellipse(size * 0.50, size * 0.07, size * 0.29, size * 0.06, 0, 0, Math.PI * 2);
    sCtx.fill();
    sCtx.beginPath();
    sCtx.ellipse(size * 0.50, size * 0.94, size * 0.34, size * 0.075, 0, 0, Math.PI * 2);
    sCtx.fill();
  };

  if (sCtx) {
    if (earthImg.complete && earthImg.naturalWidth > 0) {
      sCtx.drawImage(earthImg, 0, 0, size, size);
    } else {
      renderProceduralSurface();
      earthImg.onload = () => {
        sCtx.clearRect(0, 0, size, size);
        sCtx.drawImage(earthImg, 0, 0, size, size);
      };
    }
  }

  // 2. Earth Clouds Layer (Ultra-Realistic Fractal Multi-Scale Weather Systems)
  // Irregular cyclones, ITCZ tropical convergence bands, mid-latitude fronts, cumulus clusters
  const clouds = document.createElement('canvas');
  clouds.width = size;
  clouds.height = size;
  const cCtx = clouds.getContext('2d');

  if (cCtx) {
    const cImgData = cCtx.createImageData(size, size);
    const cData = cImgData.data;

    for (let py = 0; py < size; py++) {
      const ny = py / size;
      for (let px = 0; px < size; px++) {
        const nx = px / size;
        const idx = (py * size + px) * 4;

        // Base multi-octave cloud turbulence
        const cloudFbm = fbm2D(nx * 6.0, ny * 6.0, 5, 2.2, 0.55);
        const cloudTurb = turbulence2D(nx * 10.0 + cloudFbm * 0.4, ny * 10.0 + cloudFbm * 0.4, 4);

        // ITCZ Tropical Convergence Band near Equator (ny ~ 0.46 to 0.54)
        const itczDist = Math.abs(ny - 0.50);
        const itczBoost = Math.exp(-itczDist * itczDist * 40.0) * 0.45;

        // Mid-latitude Cyclonic Fronts (ny ~ 0.28 and ny ~ 0.72)
        const nStormDist = Math.abs(ny - 0.28);
        const sStormDist = Math.abs(ny - 0.72);
        const midLatBoost = (Math.exp(-nStormDist * nStormDist * 30.0) + Math.exp(-sStormDist * sStormDist * 30.0)) * 0.35;

        // Swirling Hurricane Vortex 1 (North Atlantic: nx=0.34, ny=0.34)
        const v1Dx = nx - 0.34;
        const v1Dy = ny - 0.34;
        const v1Dist = Math.sqrt(v1Dx * v1Dx + v1Dy * v1Dy);
        const v1Angle = Math.atan2(v1Dy, v1Dx);
        const spiral1 = Math.sin(v1Angle * 2.0 - v1Dist * 25.0);
        const vortex1 = v1Dist < 0.14 ? (1.0 - v1Dist / 0.14) * Math.max(0, spiral1) * 0.75 : 0;

        // Swirling Hurricane Vortex 2 (Northwest Pacific: nx=0.76, ny=0.32)
        const v2Dx = nx - 0.76;
        const v2Dy = ny - 0.32;
        const v2Dist = Math.sqrt(v2Dx * v2Dx + v2Dy * v2Dy);
        const v2Angle = Math.atan2(v2Dy, v2Dx);
        const spiral2 = Math.sin(v2Angle * 2.0 - v2Dist * 22.0);
        const vortex2 = v2Dist < 0.13 ? (1.0 - v2Dist / 0.13) * Math.max(0, spiral2) * 0.7 : 0;

        // Combined Cloud Density Map
        const rawDensity = cloudFbm * 0.55 + cloudTurb * 0.25 + itczBoost + midLatBoost + vortex1 + vortex2;

        // Threshold & Soft Cloud Feathering (realistic partial transparency)
        if (rawDensity > 0.44) {
          const alpha = Math.min(0.92, (rawDensity - 0.44) * 2.2);
          cData[idx] = 255;
          cData[idx + 1] = 255;
          cData[idx + 2] = 255;
          cData[idx + 3] = Math.round(alpha * 255);
        } else {
          cData[idx + 3] = 0;
        }
      }
    }

    cCtx.putImageData(cImgData, 0, 0);
  }

  // 3. Earth Night Side City Lights (Golden synaptic network along coastlines)
  const nightLights = document.createElement('canvas');
  nightLights.width = size;
  nightLights.height = size;
  const nCtx = nightLights.getContext('2d');

  if (nCtx) {
    // Metropolises and dense coastal ribbons
    const cities = [
      // Europe / Mediterranean
      { x: 0.48, y: 0.26, r: 3.5, a: 0.95 }, // London/Paris/Benelux
      { x: 0.52, y: 0.28, r: 3.0, a: 0.90 }, // Central Europe / Berlin / Rome
      { x: 0.57, y: 0.25, r: 2.5, a: 0.85 }, // Moscow
      { x: 0.46, y: 0.32, r: 2.2, a: 0.80 }, // Madrid / Iberia
      // North America
      { x: 0.27, y: 0.32, r: 4.2, a: 0.98 }, // US East Coast Megalopolis
      { x: 0.22, y: 0.33, r: 2.8, a: 0.88 }, // US Midwest / Chicago
      { x: 0.16, y: 0.34, r: 3.2, a: 0.92 }, // California / West Coast
      { x: 0.23, y: 0.42, r: 2.6, a: 0.85 }, // Texas / Gulf Coast
      // East & South Asia
      { x: 0.78, y: 0.35, r: 4.5, a: 0.98 }, // Tokyo / Japan Belt
      { x: 0.74, y: 0.38, r: 4.0, a: 0.95 }, // Shanghai / Eastern China
      { x: 0.73, y: 0.44, r: 3.2, a: 0.90 }, // Pearl River / Hong Kong
      { x: 0.65, y: 0.42, r: 3.8, a: 0.92 }, // Indo-Gangetic Plain / Mumbai
      // Middle East & Africa
      { x: 0.58, y: 0.38, r: 2.8, a: 0.85 }, // Persian Gulf / Dubai
      { x: 0.54, y: 0.36, r: 3.2, a: 0.90 }, // Nile River Ribbon
      { x: 0.53, y: 0.74, r: 2.4, a: 0.80 }, // Johannesburg / S Africa
      // South America
      { x: 0.31, y: 0.66, r: 3.2, a: 0.92 }, // Sao Paulo / Rio de Janeiro
      { x: 0.28, y: 0.72, r: 2.6, a: 0.85 }, // Buenos Aires
      // Australia
      { x: 0.82, y: 0.70, r: 2.8, a: 0.88 }, // Sydney / Melbourne
    ];

    cities.forEach((ct) => {
      const grad = nCtx.createRadialGradient(
        ct.x * size,
        ct.y * size,
        0,
        ct.x * size,
        ct.y * size,
        ct.r * 2.5
      );
      grad.addColorStop(0, `rgba(255, 220, 130, ${ct.a})`);
      grad.addColorStop(0.35, `rgba(255, 175, 75, ${ct.a * 0.7})`);
      grad.addColorStop(0.7, `rgba(220, 120, 30, ${ct.a * 0.25})`);
      grad.addColorStop(1, 'rgba(200, 100, 20, 0)');
      nCtx.fillStyle = grad;
      nCtx.beginPath();
      nCtx.arc(ct.x * size, ct.y * size, ct.r * 2.5, 0, Math.PI * 2);
      nCtx.fill();
    });
  }

  return { surface, clouds, nightLights };
}

// ============================================================================
// 3. PHOTOREALISTIC JUPITER (Turbulent Belts, GRS Vortex, Zonal Shear, Storm Ovals)
// ============================================================================
export function createJupiterTexture(size: number = 512): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Zonal Atmospheric Latitudinal Bands Color Table [yNorm, [R, G, B]]
  const zonalColors = [
    { y: 0.00, c: [78, 62, 48] },    // North Polar Region
    { y: 0.16, c: [124, 102, 80] },  // North Temperate Belt
    { y: 0.28, c: [225, 212, 188] }, // North Tropical Zone
    { y: 0.38, c: [156, 94, 58] },   // North Equatorial Belt (Dark reddish brown)
    { y: 0.48, c: [232, 220, 194] }, // Equatorial Zone
    { y: 0.58, c: [142, 76, 44] },   // South Equatorial Belt (Deep rust orange)
    { y: 0.72, c: [220, 205, 178] }, // South Tropical Zone
    { y: 0.84, c: [120, 94, 72] },   // South Temperate Belt
    { y: 1.00, c: [68, 54, 42] },    // South Polar Region
  ];

  // Helper to interpolate zonal colors
  function getZonalColor(yNorm: number): [number, number, number] {
    for (let i = 0; i < zonalColors.length - 1; i++) {
      const z0 = zonalColors[i];
      const z1 = zonalColors[i + 1];
      if (yNorm >= z0.y && yNorm <= z1.y) {
        const t = (yNorm - z0.y) / (z1.y - z0.y);
        return [
          z0.c[0] + (z1.c[0] - z0.c[0]) * t,
          z0.c[1] + (z1.c[1] - z0.c[1]) * t,
          z0.c[2] + (z1.c[2] - z0.c[2]) * t,
        ];
      }
    }
    return [120, 100, 80];
  }

  // Generate turbulent shear-wave atmospheric flow
  for (let py = 0; py < size; py++) {
    const ny = py / size;
    for (let px = 0; px < size; px++) {
      const nx = px / size;
      const idx = (py * size + px) * 4;

      // Zonal wind shear turbulence
      const shearTurb = fbm2D(nx * 14.0, ny * 28.0, 4, 2.1, 0.5);
      const waveShift = (shearTurb - 0.5) * 0.055;
      const warpedY = Math.min(1, Math.max(0, ny + waveShift));

      const baseC = getZonalColor(warpedY);
      const microNoise = (hash2D(px * 2.1, py * 1.9) - 0.5) * 12;

      data[idx] = Math.min(255, Math.max(0, baseC[0] + microNoise));
      data[idx + 1] = Math.min(255, Math.max(0, baseC[1] + microNoise * 0.9));
      data[idx + 2] = Math.min(255, Math.max(0, baseC[2] + microNoise * 0.8));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // The Great Red Spot (Anticyclonic vortex in South Tropical Zone: x=0.62, y=0.63)
  const grsX = size * 0.62;
  const grsY = size * 0.63;
  const grsRx = size * 0.082;
  const grsRy = size * 0.048;

  // Outer turbulent hollow boundary
  const grsHollow = ctx.createRadialGradient(grsX, grsY, grsRx * 0.6, grsX, grsY, grsRx * 1.3);
  grsHollow.addColorStop(0, 'rgba(235, 225, 205, 0)');
  grsHollow.addColorStop(0.7, 'rgba(245, 238, 220, 0.45)');
  grsHollow.addColorStop(1, 'rgba(200, 185, 160, 0)');
  ctx.fillStyle = grsHollow;
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, grsRx * 1.3, grsRy * 1.3, -0.05, 0, Math.PI * 2);
  ctx.fill();

  // Core Red Spot Vortex (Crimson/Terracotta Core with Counter-rotating Ring)
  const grsGrad = ctx.createRadialGradient(grsX, grsY, 0, grsX, grsY, grsRx);
  grsGrad.addColorStop(0, '#C24822');
  grsGrad.addColorStop(0.5, '#A83B1A');
  grsGrad.addColorStop(0.85, '#8E2E12');
  grsGrad.addColorStop(1, 'rgba(142, 46, 18, 0)');
  ctx.fillStyle = grsGrad;
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, grsRx, grsRy, -0.05, 0, Math.PI * 2);
  ctx.fill();

  // White anticyclonic storm ovals (String of Pearls)
  const ovals = [
    { x: 0.32, y: 0.64, rx: 0.022, ry: 0.013 },
    { x: 0.42, y: 0.64, rx: 0.019, ry: 0.012 },
    { x: 0.82, y: 0.64, rx: 0.020, ry: 0.013 },
    { x: 0.24, y: 0.33, rx: 0.024, ry: 0.014 },
    { x: 0.72, y: 0.34, rx: 0.022, ry: 0.013 },
  ];

  ovals.forEach((ov) => {
    const oGrad = ctx.createRadialGradient(
      ov.x * size,
      ov.y * size,
      0,
      ov.x * size,
      ov.y * size,
      ov.rx * size
    );
    oGrad.addColorStop(0, 'rgba(255, 252, 245, 0.95)');
    oGrad.addColorStop(0.7, 'rgba(240, 235, 225, 0.65)');
    oGrad.addColorStop(1, 'rgba(220, 210, 195, 0)');
    ctx.fillStyle = oGrad;
    ctx.beginPath();
    ctx.ellipse(ov.x * size, ov.y * size, ov.rx * size, ov.ry * size, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  return canvas;
}

// ============================================================================
// 4. PHOTOREALISTIC MARS (Iron Oxide Rust, Syrtis Major Basalt, Valles Marineris, Ice Cap)
// ============================================================================
export function createMarsTexture(size: number = 512): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let py = 0; py < size; py++) {
    const ny = py / size;
    for (let px = 0; px < size; px++) {
      const nx = px / size;
      const idx = (py * size + px) * 4;

      const fbm = fbm2D(nx * 8.0, ny * 8.0, 5, 2.0, 0.52);
      const grain = (hash2D(px * 1.5, py * 1.3) - 0.5) * 14;

      // Base Martian Highland Ochre Rust (#C86438 -> #9E4522)
      const baseR = 195 + fbm * 50;
      const baseG = 95 + fbm * 35;
      const baseB = 52 + fbm * 22;

      data[idx] = Math.min(255, Math.max(0, baseR + grain));
      data[idx + 1] = Math.min(255, Math.max(0, baseG + grain * 0.7));
      data[idx + 2] = Math.min(255, Math.max(0, baseB + grain * 0.5));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Dark Basalt Lowland Volcanic Plains (Syrtis Major, Acidalia Planitia, Hellas Basin)
  ctx.fillStyle = 'rgba(52, 30, 22, 0.72)';
  // Syrtis Major (distinct triangular dark albedo feature)
  ctx.beginPath();
  ctx.moveTo(size * 0.44, size * 0.40);
  ctx.bezierCurveTo(size * 0.53, size * 0.36, size * 0.63, size * 0.45, size * 0.58, size * 0.58);
  ctx.bezierCurveTo(size * 0.52, size * 0.65, size * 0.42, size * 0.56, size * 0.44, size * 0.40);
  ctx.closePath();
  ctx.fill();

  // Acidalia Planitia (Northern dark basalt plain)
  ctx.beginPath();
  ctx.ellipse(size * 0.28, size * 0.30, size * 0.10, size * 0.06, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Valles Marineris Canyon Rift System (Grand Canyon of Mars)
  ctx.strokeStyle = 'rgba(38, 18, 12, 0.85)';
  ctx.lineWidth = size * 0.014;
  ctx.beginPath();
  ctx.moveTo(size * 0.22, size * 0.53);
  ctx.quadraticCurveTo(size * 0.34, size * 0.50, size * 0.46, size * 0.55);
  ctx.stroke();

  // Olympus Mons Caldera Shield (Western Tharsis: nx=0.17, ny=0.42)
  const oGrad = ctx.createRadialGradient(
    size * 0.17,
    size * 0.42,
    0,
    size * 0.17,
    size * 0.42,
    size * 0.035
  );
  oGrad.addColorStop(0, 'rgba(235, 145, 95, 0.85)');
  oGrad.addColorStop(0.7, 'rgba(160, 75, 40, 0.6)');
  oGrad.addColorStop(1, 'rgba(140, 60, 30, 0)');
  ctx.fillStyle = oGrad;
  ctx.beginPath();
  ctx.arc(size * 0.17, size * 0.42, size * 0.035, 0, Math.PI * 2);
  ctx.fill();

  // Planum Boreum Northern Polar Ice Cap (CO2 / Water Ice Frost)
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(size * 0.50, size * 0.08, size * 0.17, size * 0.052, 0, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

// ============================================================================
// 5. PHOTOREALISTIC SATURN & 3D RINGS (Butterscotch Bands, Cassini Division, Crepe Ring)
// ============================================================================
export function createSaturnTextures(size: number = 512): {
  planet: HTMLCanvasElement;
  rings: HTMLCanvasElement;
} {
  // 1. Saturn Planet Body (Soft golden-amber atmospheric bands with subtle turbulence)
  const planet = document.createElement('canvas');
  planet.width = size;
  planet.height = size;
  const pCtx = planet.getContext('2d');
  if (pCtx) {
    const pGrad = pCtx.createLinearGradient(0, 0, 0, size);
    pGrad.addColorStop(0, '#756344');    // North Polar Hood
    pGrad.addColorStop(0.18, '#B29B6E'); // North Temperate Zone
    pGrad.addColorStop(0.38, '#E4D1A5'); // North Tropical Belt
    pGrad.addColorStop(0.50, '#F6E7C6'); // Equatorial Zone (Bright cream gold)
    pGrad.addColorStop(0.64, '#D4BF8C'); // South Tropical Belt
    pGrad.addColorStop(0.84, '#A28C64'); // South Temperate Zone
    pGrad.addColorStop(1, '#635336');    // South Polar Hood
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, size, size);

    // Subtle atmospheric wave perturbations
    pCtx.lineWidth = 1.2;
    for (let y = 12; y < size - 12; y += 10) {
      pCtx.strokeStyle = y % 20 === 0 ? 'rgba(95, 78, 50, 0.2)' : 'rgba(255, 248, 230, 0.15)';
      pCtx.beginPath();
      pCtx.moveTo(0, y);
      for (let x = 0; x < size; x += 16) {
        const wave = Math.sin(x * 0.04 + y * 0.08) * 1.5;
        pCtx.lineTo(x, y + wave);
      }
      pCtx.stroke();
    }
  }

  // 2. Saturn Ring System (A Ring, Cassini Division, B Ring, C Crepe Ring)
  const rings = document.createElement('canvas');
  rings.width = size * 2;
  rings.height = size * 2;
  const rCtx = rings.getContext('2d');

  if (rCtx) {
    const cx = size;
    const cy = size;
    const maxR = size * 0.96;

    // A Ring (Outer Ring: 0.82 to 1.00 of maxR)
    const aGrad = rCtx.createRadialGradient(cx, cy, maxR * 0.82, cx, cy, maxR);
    aGrad.addColorStop(0, 'rgba(215, 196, 158, 0.72)');
    aGrad.addColorStop(0.45, 'rgba(238, 222, 185, 0.88)');
    aGrad.addColorStop(0.85, 'rgba(202, 182, 142, 0.68)');
    aGrad.addColorStop(1, 'rgba(180, 160, 120, 0)');
    rCtx.fillStyle = aGrad;
    rCtx.beginPath();
    rCtx.arc(cx, cy, maxR, 0, Math.PI * 2);
    rCtx.arc(cx, cy, maxR * 0.82, 0, Math.PI * 2, true);
    rCtx.fill();

    // Cassini Division: naturally clear dark empty gap between 0.78 and 0.82

    // B Ring (Main Bright Dense Ring: 0.58 to 0.78 of maxR)
    const bGrad = rCtx.createRadialGradient(cx, cy, maxR * 0.58, cx, cy, maxR * 0.78);
    bGrad.addColorStop(0, 'rgba(212, 192, 152, 0.82)');
    bGrad.addColorStop(0.3, 'rgba(252, 240, 208, 0.98)');
    bGrad.addColorStop(0.7, 'rgba(244, 228, 192, 0.94)');
    bGrad.addColorStop(1, 'rgba(218, 198, 158, 0.88)');
    rCtx.fillStyle = bGrad;
    rCtx.beginPath();
    rCtx.arc(cx, cy, maxR * 0.78, 0, Math.PI * 2);
    rCtx.arc(cx, cy, maxR * 0.58, 0, Math.PI * 2, true);
    rCtx.fill();

    // C Ring (Crepe Ring - Semi-transparent Inner Dusky Ring: 0.44 to 0.58 of maxR)
    const cGrad = rCtx.createRadialGradient(cx, cy, maxR * 0.44, cx, cy, maxR * 0.58);
    cGrad.addColorStop(0, 'rgba(130, 110, 80, 0)');
    cGrad.addColorStop(0.5, 'rgba(172, 152, 120, 0.35)');
    cGrad.addColorStop(1, 'rgba(196, 176, 142, 0.48)');
    rCtx.fillStyle = cGrad;
    rCtx.beginPath();
    rCtx.arc(cx, cy, maxR * 0.58, 0, Math.PI * 2);
    rCtx.arc(cx, cy, maxR * 0.44, 0, Math.PI * 2, true);
    rCtx.fill();
  }

  return { planet, rings };
}

// ============================================================================
// 6. OTHER PLANETS (Mercury, Venus, Uranus, Neptune)
// ============================================================================

export function createVenusTexture(size: number = 256): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Creamy golden sulfuric acid cloud veil with subtle planetary chevron waves
  const grad = ctx.createRadialGradient(size * 0.4, size * 0.4, 0, size * 0.5, size * 0.5, size * 0.5);
  grad.addColorStop(0, '#FFF6E2');
  grad.addColorStop(0.55, '#E8D4B0');
  grad.addColorStop(0.85, '#D0B98E');
  grad.addColorStop(1, '#A8926B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Soft atmospheric chevron streaks
  ctx.strokeStyle = 'rgba(255, 250, 235, 0.25)';
  ctx.lineWidth = size * 0.04;
  for (let y = size * 0.2; y < size * 0.8; y += size * 0.18) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(size * 0.5, y + size * 0.08, size, y);
    ctx.stroke();
  }

  return canvas;
}

export function createMercuryTexture(size: number = 256): HTMLCanvasElement {
  return createMoonTexture(size); // Highly cratered basalt grey regolith
}

export function createUranusTexture(size: number = 256): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Pale aquamarine / cyan methane atmosphere with smooth limb darkening
  const grad = ctx.createRadialGradient(size * 0.4, size * 0.4, 0, size * 0.5, size * 0.5, size * 0.5);
  grad.addColorStop(0, '#C2EEF8');
  grad.addColorStop(0.65, '#85CCE8');
  grad.addColorStop(0.9, '#529EC0');
  grad.addColorStop(1, '#326D8A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  return canvas;
}

export function createNeptuneTexture(size: number = 256): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Deep royal azure blue methane atmosphere
  const grad = ctx.createRadialGradient(size * 0.4, size * 0.4, 0, size * 0.5, size * 0.5, size * 0.5);
  grad.addColorStop(0, '#4288F4');
  grad.addColorStop(0.6, '#205EC0');
  grad.addColorStop(0.85, '#123D8A');
  grad.addColorStop(1, '#081D48');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Neptune's Great Dark Spot (nx=0.6, ny=0.45)
  ctx.fillStyle = 'rgba(10, 35, 85, 0.7)';
  ctx.beginPath();
  ctx.ellipse(size * 0.6, size * 0.45, size * 0.09, size * 0.05, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Bright white high-altitude methane cirrus streaks (Scooter)
  ctx.strokeStyle = 'rgba(240, 248, 255, 0.8)';
  ctx.lineWidth = size * 0.015;
  ctx.beginPath();
  ctx.moveTo(size * 0.52, size * 0.52);
  ctx.quadraticCurveTo(size * 0.64, size * 0.50, size * 0.74, size * 0.53);
  ctx.stroke();

  return canvas;
}

// ============================================================================
// INITIALIZE ALL TEXTURES ONCE FOR ULTRA-HIGH PERFORMANCE
// ============================================================================
export function initializeCelestialTextures(): CelestialTextures {
  const moon = createMoonTexture(512);
  const earth = createEarthTextures(512);
  const mercury = createMercuryTexture(256);
  const venus = createVenusTexture(256);
  const mars = createMarsTexture(512);
  const jupiter = createJupiterTexture(512);
  const saturnData = createSaturnTextures(512);
  const uranus = createUranusTexture(256);
  const neptune = createNeptuneTexture(256);

  return {
    moon,
    earthSurface: earth.surface,
    earthClouds: earth.clouds,
    earthNightLights: earth.nightLights,
    mercury,
    venus,
    mars,
    jupiter,
    saturn: saturnData.planet,
    saturnRings: saturnData.rings,
    uranus,
    neptune,
  };
}
