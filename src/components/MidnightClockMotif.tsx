import React from 'react';
import { motion } from 'motion/react';
import { MidnightClockMotifProps } from '../types';

export const MidnightClockMotif: React.FC<MidnightClockMotifProps> = ({
  progress = 0,
  currentTimeLabel = '11:45 PM',
  isMidnight = false,
  className = '',
}) => {
  // Angle for the minute hand: map progress (0 to 1) from ~10:45 PM (around 270 deg) to 12:00 AM (360 / 0 deg)
  // Hour hand sweeps from ~330 deg (11 PM) to 360 deg (12 AM)
  const hourAngle = 330 + progress * 30; // 330° -> 360°
  const minuteAngle = 270 + progress * 90; // 270° (45 min) -> 360° (00 min)

  // Celestial constellation nodes on the dial perimeter
  const constellationNodes = [
    { angle: 30, r: 88, size: 2.5, glow: false },
    { angle: 90, r: 88, size: 3, glow: false },
    { angle: 160, r: 88, size: 2, glow: false },
    { angle: 220, r: 88, size: 2.5, glow: false },
    { angle: 280, r: 88, size: 3.5, glow: isMidnight },
    { angle: 330, r: 88, size: 3, glow: isMidnight },
    { angle: 0, r: 88, size: 4.5, glow: true }, // Midnight Zenith Node
  ];

  return (
    <div
      id="midnight-clock-motif"
      className={`relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Background Soft Starlight & Navy Radiance Aura */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-1000"
        style={{
          background: isMidnight
            ? 'radial-gradient(circle, rgba(240, 230, 200, 0.16) 0%, rgba(60, 90, 140, 0.12) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(140, 180, 240, 0.1) 0%, rgba(20, 35, 60, 0.08) 50%, transparent 75%)',
          transform: `scale(${isMidnight ? 1.3 : 1})`,
        }}
      />

      {/* SVG Celestial Dial */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full absolute inset-0 overflow-visible"
      >
        <defs>
          <radialGradient id="dialCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isMidnight ? 0.35 : 0.15} />
            <stop offset="60%" stopColor="#8cb9f0" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orbitStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isMidnight ? 0.8 : 0.4} />
            <stop offset="50%" stopColor="#8cb9f0" stopOpacity={isMidnight ? 0.4 : 0.15} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={isMidnight ? 0.6 : 0.2} />
          </linearGradient>
          <linearGradient id="handGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.95)" />
          </linearGradient>
        </defs>

        {/* Center Aura Circle */}
        <circle cx="100" cy="100" r="70" fill="url(#dialCenterGlow)" />

        {/* Outer Fine Astrological Ring */}
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="url(#orbitStroke)"
          strokeWidth="0.85"
          strokeDasharray="2 6"
        />

        {/* Inner Precision Dial Ring */}
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="0.6"
        />

        {/* 12 Hour Ticks (Minimal delicate dashes) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const deg = i * 30;
          const isMain = deg === 0 || deg === 90 || deg === 180 || deg === 270;
          const isMidnightTick = deg === 0;
          return (
            <line
              key={`dial-tick-${i}`}
              x1="100"
              y1={isMain ? '16' : '20'}
              x2="100"
              y2="24"
              stroke={isMidnightTick && isMidnight ? '#fff' : 'rgba(255,255,255,0.3)'}
              strokeWidth={isMidnightTick && isMidnight ? 1.75 : isMain ? 1.2 : 0.6}
              transform={`rotate(${deg} 100 100)`}
              className="transition-colors duration-700"
            />
          );
        })}

        {/* Connecting Stardust Constellation Arcs */}
        <motion.path
          d="M 100,12 A 88,88 0 0,1 188,100"
          fill="none"
          stroke="rgba(180, 215, 255, 0.25)"
          strokeWidth="0.75"
          strokeDasharray="3 4"
        />

        {/* Constellation Nodes around dial */}
        {constellationNodes.map((node, idx) => {
          const rad = (node.angle - 90) * (Math.PI / 180);
          const cx = 100 + node.r * Math.cos(rad);
          const cy = 100 + node.r * Math.sin(rad);
          return (
            <g key={`constellation-node-${idx}`}>
              {node.glow && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={node.size * 2}
                  fill="rgba(255, 255, 255, 0.3)"
                  className={isMidnight ? 'animate-pulse' : ''}
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={node.size}
                fill={node.glow && isMidnight ? '#ffffff' : 'rgba(230, 240, 255, 0.7)'}
              />
            </g>
          );
        })}

        {/* Hour Hand (Short, refined) */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="54"
          stroke="url(#handGradient)"
          strokeWidth="1.75"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 100 100)`}
          className="transition-transform duration-300 ease-out"
        />

        {/* Minute Hand (Long, fine needle) */}
        <line
          x1="100"
          y1="105"
          x2="100"
          y2="34"
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="1"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 100 100)`}
          className="transition-transform duration-300 ease-out"
        />

        {/* Central Pivot Jewel Star */}
        <circle cx="100" cy="100" r="3" fill="#ffffff" />
        <circle cx="100" cy="100" r="5" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.75" />

        {/* Midnight Flare when reached */}
        {isMidnight && (
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            transform="translate(100, 12)"
          >
            <circle cx="0" cy="0" r="9" fill="rgba(255, 255, 255, 0.25)" />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="rgba(255,255,255,0.7)" strokeWidth="0.75" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(255,255,255,0.7)" strokeWidth="0.75" />
          </motion.g>
        )}
      </svg>

      {/* Center Dynamic Time Capsule Badge */}
      <div className="absolute bottom-2 flex flex-col items-center">
        <span
          className={`font-body text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium transition-colors duration-500 ${
            isMidnight ? 'text-white font-semibold' : 'text-white/60'
          }`}
          style={{
            textShadow: isMidnight ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none',
          }}
        >
          {currentTimeLabel}
        </span>
      </div>
    </div>
  );
};
