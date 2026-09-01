import React from 'react';

export interface MediaPlaceholderProps {
  id: string;
  label?: string;
  sublabel?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | 'circle';
  className?: string;
  children?: React.ReactNode;
}

export const MediaPlaceholder: React.FC<MediaPlaceholderProps> = ({
  id,
  label,
  sublabel,
  aspectRatio = 'square',
  className = '',
  children,
}) => {
  const aspectClass =
    aspectRatio === 'circle'
      ? 'rounded-full aspect-square'
      : aspectRatio === 'video'
      ? 'rounded-xl aspect-video'
      : aspectRatio === 'portrait'
      ? 'rounded-xl aspect-[3/4]'
      : aspectRatio === 'wide'
      ? 'rounded-xl aspect-[21/9]'
      : 'rounded-xl aspect-square';

  return (
    <div
      id={id}
      data-placeholder-type="media-foundation"
      className={`relative overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-sm flex flex-col items-center justify-center p-6 transition-all duration-500 hover:border-white/20 ${aspectClass} ${className}`}
    >
      {/* Subtle celestial ambient corner guides */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/20" />

      {children ? (
        children
      ) : (
        <div className="flex flex-col items-center text-center space-y-1 select-none pointer-events-none">
          {label && (
            <span className="font-body text-[11px] font-medium tracking-[0.2em] uppercase text-white/50">
              {label}
            </span>
          )}
          {sublabel && (
            <span className="font-editorial italic text-xs text-white/30">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
