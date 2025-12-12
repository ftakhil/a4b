"use client";
import React from 'react';

interface CardBackProps {
    onTap: () => void;
}

const CardBack: React.FC<CardBackProps> = ({ onTap }) => {
    const sparkles = [
        { top: '15%', left: '18%', delay: '0s', size: 'w-1 h-1' },
        { top: '22%', left: '85%', delay: '1.2s', size: 'w-0.5 h-0.5' },
        { top: '55%', left: '8%', delay: '0.5s', size: 'w-1 h-1' },
        { top: '78%', left: '72%', delay: '2.1s', size: 'w-0.5 h-0.5' },
        { top: '38%', left: '52%', delay: '0.3s', size: 'w-1.5 h-1.5' },
        { top: '12%', left: '92%', delay: '1.8s', size: 'w-0.5 h-0.5' },
        { top: '88%', left: '28%', delay: '1.5s', size: 'w-1 h-1' },
    ];

    return (
        <div
            onClick={onTap}
            className="absolute inset-0 w-full h-full rounded-[20px] bg-matte-black noise-bg shadow-soft-glow cursor-pointer overflow-hidden group border border-white/5 backface-hidden flex items-center justify-center"
        >
            {/* Glittering White Effects */}
            {sparkles.map((sparkle, i) => (
                <div
                    key={i}
                    className={`absolute bg-white/80 rounded-full animate-glitter shadow-[0_0_8px_1px_rgba(255,255,255,0.4)] ${sparkle.size}`}
                    style={{
                        top: sparkle.top,
                        left: sparkle.left,
                        animationDelay: sparkle.delay,
                        opacity: 0,
                    }}
                />
            ))}

            {/* Center Logo/Icon */}
            <div className="flex flex-col items-center gap-4 transition-transform duration-700 group-hover:scale-105">
                <div className="w-20 h-20 rounded-full bg-surface-highlight flex items-center justify-center border border-white/5 shadow-inner p-5">
                    {/* Custom Logo based on reference: Thick abstract loop with dots */}
                    <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-text/90">
                        {/* Main Loop Structure */}
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M30 25C13.4315 25 0 38.4315 0 55C0 71.5685 13.4315 85 30 85C39.654 85 48.2575 80.435 53.865 73.25L46.135 67.75C42.54 72.8 36.6 76 30 76C18.402 76 9 66.598 9 55C9 43.402 18.402 34 30 34C36.6 34 42.54 37.2 46.135 42.25L53.865 36.75C48.2575 29.565 39.654 25 30 25ZM70 25C60.346 25 51.7425 29.565 46.135 36.75L53.865 42.25C57.46 37.2 63.4 34 70 34C81.598 34 91 43.402 91 55C91 66.598 81.598 76 70 76C63.4 76 57.46 72.8 53.865 67.75L46.135 73.25C51.7425 80.435 60.346 85 70 85C86.5685 85 100 71.5685 100 55C100 38.4315 86.5685 25 70 25Z"
                        />
                        {/* Connecting diagonal (implied) or center structure - stylized as open */}

                        {/* Dots in the loops */}
                        <circle cx="30" cy="55" r="7" />
                        <circle cx="70" cy="55" r="7" />
                    </svg>
                </div>

                {/* Text */}
                <p className="font-sans text-[10px] font-medium tracking-[0.2em] text-text-muted/60 uppercase group-hover:text-text/80 transition-colors">
                    Tap to Access
                </p>
            </div>

            {/* Subtle Haptic Corners */}
            <div className="absolute top-5 left-5 w-1 h-1 bg-white/20 rounded-full"></div>
            <div className="absolute top-5 right-5 w-1 h-1 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-5 left-5 w-1 h-1 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-5 right-5 w-1 h-1 bg-white/20 rounded-full"></div>
        </div>
    );
};

export default CardBack;
