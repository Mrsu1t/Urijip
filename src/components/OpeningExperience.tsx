import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AnimatedTextLine } from './AnimatedText';
import { StarlightFocus } from './StarlightFocus';
import { ScrollIndicator } from './ScrollIndicator';
import { ANIMATION_TOKENS, Z_INDEX_TOKENS } from '../tokens';

interface OpeningExperienceProps {
  scrollProgress: number;
  onScrollClick: () => void;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({
  scrollProgress,
  onScrollClick,
}) => {
  // Stepwise reveal timeline states
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const [showStarlight, setShowStarlight] = useState(false);
  const [showFocalStar, setShowFocalStar] = useState(false);
  const [showScrollPrompt, setShowScrollPrompt] = useState(false);

  useEffect(() => {
    // Reveal lines with smooth pacing
    const t1 = setTimeout(() => setShowLine1(true), 200);
    const t2 = setTimeout(() => setShowLine2(true), 1200);
    const t3 = setTimeout(() => setShowLine3(true), 2200);
    const tStarLight = setTimeout(() => setShowStarlight(true), 3000);
    const tStar = setTimeout(() => setShowFocalStar(true), 3600);
    const tScroll = setTimeout(() => setShowScrollPrompt(true), 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tStarLight);
      clearTimeout(tStar);
      clearTimeout(tScroll);
    };
  }, []);

  // Calculate scroll-driven text fading and movement for cinematic transition into darkness
  const textOpacity = Math.max(0, 1 - scrollProgress * 3.0);
  const textTranslateY = -scrollProgress * 80;

  return (
    <section
      id="opening-experience-section"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-between px-4 sm:px-8 md:px-12 py-10 sm:py-14 select-none overflow-hidden"
      style={{ zIndex: Z_INDEX_TOKENS.contentLayer }}
      aria-label="URIJIP Opening - Starlight Story"
    >
      {/* Top ambient breathing room spacer */}
      <div className="w-full h-6 sm:h-10 flex-shrink-0" />

      {/* Center Cinematic Opening Text Sequence */}
      <div
        className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center my-auto transition-transform duration-100 ease-out"
        style={{
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
        }}
      >
        {/* Line 1 */}
        {showLine1 && (
          <AnimatedTextLine id="opening-line-1" delay={0}>
            Somewhere between a voice I couldn't stop listening to...
          </AnimatedTextLine>
        )}

        {/* Line 2 */}
        {showLine2 && (
          <AnimatedTextLine id="opening-line-2" delay={0.15} className="mt-4 sm:mt-6 md:mt-8">
            and a girl I couldn't stop thinking about...
          </AnimatedTextLine>
        )}

        {/* Line 3 - "I found" */}
        {showLine3 && (
          <div className="w-full flex flex-col items-center mt-5 sm:mt-7 md:mt-9">
            <AnimatedTextLine id="opening-line-3" delay={0.1}>
              I found
            </AnimatedTextLine>

            {/* Dedicated Dramatic 우리 집 line */}
            {showStarlight && (
              <motion.div
                id="opening-urijip-emphasis"
                initial={{ opacity: 0, scale: 0.92, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: ANIMATION_TOKENS.duration.slow,
                  delay: 0.1,
                  ease: ANIMATION_TOKENS.easing.cinematic,
                }}
                className="w-full max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8 mt-3 sm:mt-4 md:mt-5"
              >
                <h1
                  id="urijip-hero-title"
                  className="font-editorial text-[clamp(2.85rem,9vw,6.25rem)] font-bold text-white tracking-[0.14em] sm:tracking-[0.2em] starlight-heavy-glow leading-none select-none"
                >
                  우리 집
                </h1>
              </motion.div>
            )}

            {/* Bright Focal Star */}
            <div className="mt-8 sm:mt-10 md:mt-12">
              <StarlightFocus
                visible={showFocalStar}
                scrollProgress={scrollProgress}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="w-full h-16 sm:h-20 flex items-center justify-center flex-shrink-0">
        <ScrollIndicator
          visible={showScrollPrompt}
          scrollProgress={scrollProgress}
          onClick={onScrollClick}
        />
      </div>
    </section>
  );
};
