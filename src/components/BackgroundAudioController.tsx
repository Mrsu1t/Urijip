import React, { useState } from 'react';
import { Play, Pause, Music, Volume2, VolumeX } from 'lucide-react';
import { useAmbientAudio } from '../context/AudioContext';

export const BackgroundAudioController: React.FC = () => {
  const { isPlaying, togglePlay, isMuted, toggleMute } = useAmbientAudio();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id="background-audio-controller"
      className="fixed top-4 left-4 sm:top-5 sm:left-6 z-50 flex items-center gap-2 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Primary Play/Pause Button */}
      <button
        type="button"
        id="bg-music-toggle-btn"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        aria-pressed={isPlaying}
        className="group relative flex items-center gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-[#1a1c1c]/80 hover:bg-[#282a2b]/90 border border-white/15 hover:border-[#ffafd7]/40 backdrop-blur-xl transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.6)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffafd7]"
      >
        {/* Subtle Ambient Pulse behind button when playing */}
        {isPlaying && (
          <div className="absolute -inset-1 rounded-full bg-[radial-gradient(circle,_rgba(255,175,215,0.25)_0%,_transparent_70%)] blur-sm pointer-events-none animate-pulse" />
        )}

        {/* Play/Pause Icon */}
        <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 text-[#ffafd7] group-hover:scale-110 transition-transform duration-200">
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-[#ffafd7]" strokeWidth={2.5} />
          ) : (
            <Play className="w-3.5 h-3.5 text-[#ffafd7] ml-0.5" strokeWidth={2.5} />
          )}
        </div>

        {/* Equalizer Waveform Bars when playing */}
        <div className="flex items-center gap-0.5 h-3.5 px-0.5">
          <span
            className={`w-[2px] rounded-full bg-[#ffafd7] transition-all duration-300 ${
              isPlaying ? 'animate-[bounce_0.8s_ease-in-out_infinite] h-3.5' : 'h-1 opacity-40'
            }`}
          />
          <span
            className={`w-[2px] rounded-full bg-[#ffafd7] transition-all duration-300 ${
              isPlaying ? 'animate-[bounce_1.1s_ease-in-out_infinite_0.2s] h-2.5' : 'h-1 opacity-40'
            }`}
          />
          <span
            className={`w-[2px] rounded-full bg-[#ffafd7] transition-all duration-300 ${
              isPlaying ? 'animate-[bounce_0.9s_ease-in-out_infinite_0.4s] h-3' : 'h-1 opacity-40'
            }`}
          />
        </div>

        {/* Context Label */}
        <span className="font-mono-label text-[10px] sm:text-[11px] tracking-[0.15em] text-[#e2e2e2] group-hover:text-white transition-colors">
          {isPlaying ? 'MUSIC' : 'PLAY'}
        </span>
      </button>

      {/* Quick Mute button appears on hover or mobile tap */}
      <button
        type="button"
        id="bg-music-mute-btn"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
        className={`p-2 rounded-full bg-[#1a1c1c]/70 hover:bg-[#282a2b] border border-white/10 hover:border-[#ffafd7]/30 text-[#e2e2e2] hover:text-[#ffafd7] backdrop-blur-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffafd7] ${
          isHovered || isMuted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none hidden sm:flex'
        }`}
      >
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-white/50" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};
