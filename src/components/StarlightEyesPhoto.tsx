import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { StarlightEyesPhotoProps } from '../types';

// Primary and fallback paths for the eyes photo
const CANDIDATE_SOURCES = [
  '/assets/eyes.png',
  '/eyes.png',
  'https://i.ibb.co/pjJm9tTL/dio.png',
  '/assets/eyes.jpg',
  '/eyes.jpg',
];

export const StarlightEyesPhoto: React.FC<StarlightEyesPhotoProps> = ({
  revealProgress = 0,
  isLuminous = false,
  className = '',
  customSrc,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(customSrc || '/assets/eyes.png');
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(5164 / 1720); // Natural 3.0023:1 aspect ratio
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (customSrc) {
      setImageSrc(customSrc);
      setLoadError(false);
      return;
    }

    // Try loading candidate images
    let isMounted = true;
    const testNextCandidate = async (index: number) => {
      if (index >= CANDIDATE_SOURCES.length) {
        if (isMounted) setLoadError(true);
        return;
      }

      const src = CANDIDATE_SOURCES[index];
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (isMounted) {
          setImageSrc(src);
          if (img.naturalWidth && img.naturalHeight) {
            setAspectRatio(img.naturalWidth / img.naturalHeight);
          }
          setIsLoaded(true);
          setLoadError(false);
        }
      };
      img.onerror = () => {
        testNextCandidate(index + 1);
      };
    };

    testNextCandidate(0);

    return () => {
      isMounted = false;
    };
  }, [customSrc]);

  // Handle manual photo drop or selection
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setImageSrc(resultStr);
          setLoadError(false);
          try {
            localStorage.setItem('starlight_custom_eyes_src', resultStr);
          } catch {
            // ignore storage quota
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setImageSrc(resultStr);
          setLoadError(false);
          try {
            localStorage.setItem('starlight_custom_eyes_src', resultStr);
          } catch {
            // ignore storage quota
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Mask reveal math: smooth feathered radius expanding from center to complete 100% view
  const clampedProgress = Math.max(0, Math.min(1, revealProgress));
  const isFullyRevealed = clampedProgress >= 0.88;
  const maskRadius = Math.max(20, clampedProgress * 135);
  const opacity = Math.min(1, clampedProgress * 1.35);
  const scale = 0.96 + clampedProgress * 0.04;

  return (
    <div
      id="starlight-eyes-container"
      className={`relative w-full flex flex-col items-center justify-center select-none ${className}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Hidden input to facilitate photo verification/upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />

      {/* Frame Container Perfectly Matched to the Natural Dimensions with Zero Cropping */}
      <div
        id="eyes-photograph-frame"
        className="relative w-full max-w-[94vw] sm:max-w-[88vw] md:max-w-[760px] lg:max-w-[900px] xl:max-w-[980px] rounded-xl overflow-hidden transition-all duration-300 border border-white/10 bg-[#121414]"
        style={{
          aspectRatio: `${aspectRatio}`,
          opacity,
          transform: `scale(${scale})`,
          boxShadow: isLuminous || clampedProgress > 0.6
            ? '0 0 50px 10px rgba(212, 108, 166, 0.2), 0 0 90px 20px rgba(211, 192, 224, 0.12)'
            : '0 0 25px 2px rgba(0, 0, 0, 0.95)',
        }}
      >
        {/* The Real Eyes Photograph (Framed with object-contain and exact aspect match) */}
        {imageSrc && !loadError ? (
          <img
            id="starlight-eyes-image"
            src={imageSrc}
            alt="The eyes of Starlight"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain object-center transition-all duration-500 select-none pointer-events-none"
            style={{
              // Feathered mask during reveal; completely unmasked (none) when fully revealed
              WebkitMaskImage: isFullyRevealed
                ? 'none'
                : `radial-gradient(ellipse 95% 85% at 50% 50%, rgba(0,0,0,1) ${maskRadius - 15}%, rgba(0,0,0,0.6) ${maskRadius}%, rgba(0,0,0,0) ${maskRadius + 20}%)`,
              maskImage: isFullyRevealed
                ? 'none'
                : `radial-gradient(ellipse 95% 85% at 50% 50%, rgba(0,0,0,1) ${maskRadius - 15}%, rgba(0,0,0,0.6) ${maskRadius}%, rgba(0,0,0,0) ${maskRadius + 20}%)`,
              filter: `contrast(${1 + clampedProgress * 0.04}) brightness(${0.92 + clampedProgress * 0.08})`,
            }}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                setAspectRatio(img.naturalWidth / img.naturalHeight);
              }
              setIsLoaded(true);
            }}
            onError={() => {
              if (imageSrc !== 'https://i.ibb.co/pjJm9tTL/dio.png') {
                setImageSrc('https://i.ibb.co/pjJm9tTL/dio.png');
              } else {
                setLoadError(true);
              }
            }}
          />
        ) : (
          /* High-Fidelity Celestial Eyes Canvas/SVG Artwork Fallback */
          <div
            id="starlight-eyes-artwork-fallback"
            className="w-full h-full relative bg-[#060A12] flex items-center justify-center overflow-hidden"
            style={{
              WebkitMaskImage: isFullyRevealed
                ? 'none'
                : `radial-gradient(ellipse 95% 85% at 50% 50%, rgba(0,0,0,1) ${maskRadius - 15}%, rgba(0,0,0,0.6) ${maskRadius}%, rgba(0,0,0,0) ${maskRadius + 20}%)`,
              maskImage: isFullyRevealed
                ? 'none'
                : `radial-gradient(ellipse 95% 85% at 50% 50%, rgba(0,0,0,1) ${maskRadius - 15}%, rgba(0,0,0,0.6) ${maskRadius}%, rgba(0,0,0,0) ${maskRadius + 20}%)`,
            }}
          >
            <svg
              viewBox="0 0 1000 333"
              className="w-full h-full object-contain select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <radialGradient id="eyeGlowL" cx="35%" cy="50%" r="35%">
                  <stop offset="0%" stopColor="#1E3250" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#0B1320" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#04070C" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="eyeGlowR" cx="65%" cy="50%" r="35%">
                  <stop offset="0%" stopColor="#1E3250" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#0B1320" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#04070C" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="irisGradL" cx="35%" cy="48%" r="12%">
                  <stop offset="0%" stopColor="#3A2312" />
                  <stop offset="45%" stopColor="#21140A" />
                  <stop offset="85%" stopColor="#0E0804" />
                  <stop offset="100%" stopColor="#050302" />
                </radialGradient>
                <radialGradient id="irisGradR" cx="65%" cy="48%" r="12%">
                  <stop offset="0%" stopColor="#3A2312" />
                  <stop offset="45%" stopColor="#21140A" />
                  <stop offset="85%" stopColor="#0E0804" />
                  <stop offset="100%" stopColor="#050302" />
                </radialGradient>
                <filter id="softGlow">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Deep Background Depth */}
              <rect width="1000" height="333" fill="#05080E" />

              {/* Left Eye Ambient Socket & Eyelid Curves */}
              <circle cx="350" cy="166" r="110" fill="url(#eyeGlowL)" />
              <path
                d="M 220,166 Q 350,100 480,166 Q 350,225 220,166 Z"
                fill="#0A111A"
                stroke="#1B2B3E"
                strokeWidth="1.5"
                opacity="0.9"
              />
              {/* Left Iris & Pupil */}
              <circle cx="350" cy="163" r="35" fill="url(#irisGradL)" />
              <circle cx="350" cy="163" r="16" fill="#020305" />
              {/* Left Catchlight */}
              <circle cx="342" cy="155" r="5" fill="#FFFFFF" filter="url(#softGlow)" />
              <circle cx="356" cy="169" r="2.5" fill="#D5E6FF" opacity="0.8" />

              {/* Right Eye Ambient Socket & Eyelid Curves */}
              <circle cx="650" cy="166" r="110" fill="url(#eyeGlowR)" />
              <path
                d="M 520,166 Q 650,100 780,166 Q 650,225 520,166 Z"
                fill="#0A111A"
                stroke="#1B2B3E"
                strokeWidth="1.5"
                opacity="0.9"
              />
              {/* Right Iris & Pupil */}
              <circle cx="650" cy="163" r="35" fill="url(#irisGradR)" />
              <circle cx="650" cy="163" r="16" fill="#020305" />
              {/* Right Catchlight */}
              <circle cx="642" cy="155" r="5" fill="#FFFFFF" filter="url(#softGlow)" />
              <circle cx="656" cy="169" r="2.5" fill="#D5E6FF" opacity="0.8" />

              {/* Delicate Upper Lashline Accent */}
              <path
                d="M 215,166 Q 350,96 485,166"
                fill="none"
                stroke="#080C14"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 515,166 Q 650,96 785,166"
                fill="none"
                stroke="#080C14"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {/* Subtle Ambient Corner Celestial Framing Accents */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-2.5 h-2.5 border-t border-l border-white/25 pointer-events-none" />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-2.5 h-2.5 border-t border-r border-white/25 pointer-events-none" />
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-2.5 h-2.5 border-b border-l border-white/25 pointer-events-none" />
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-2.5 h-2.5 border-b border-r border-white/25 pointer-events-none" />

        {/* Subtle Replace trigger button on hover */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 px-3 py-1 rounded-[4px] bg-[#1a1c1c]/80 hover:bg-[#282a2b] border border-white/15 text-[10px] sm:text-[11px] font-mono-label text-[#e2e2e2] hover:text-[#ffafd7] hover:border-[#ffafd7]/40 backdrop-blur-md transition-all duration-300 opacity-0 hover:opacity-100 focus:opacity-100 cursor-pointer"
          title="Upload or update eyes photograph"
        >
          Replace Photo
        </button>
      </div>

      {/* Atmospheric Star Catchlight Glow */}
      <div
        className="absolute w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-[radial-gradient(circle,_rgba(220,240,255,0.35)_0%,_rgba(160,205,255,0.1)_40%,_transparent_75%)] blur-xl pointer-events-none transition-all duration-700"
        style={{
          opacity: clampedProgress > 0.3 && clampedProgress < 0.8 ? 0.6 : 0.2,
          transform: `scale(${1 + clampedProgress * 0.4})`,
        }}
      />
    </div>
  );
};
