"use client";
import React, { useState } from 'react';
import CardBack from './components/CardBack';
import CardFront from './components/CardFront';

type AnimState = 'idle' | 'flipping' | 'flipped' | 'resetting';

const CardPage: React.FC = () => {
    const [animState, setAnimState] = useState<AnimState>('idle');
    const [isZoomed, setIsZoomed] = useState(false);

    const handleReveal = () => {
        setAnimState('flipping');
        // Zoom in near the end of the flip
        setTimeout(() => {
            setIsZoomed(true);
        }, 900);
        // Set final state after animation duration (1.2s)
        setTimeout(() => {
            setAnimState('flipped');
        }, 1200);
    };

    const handleFlipBack = () => {
        setIsZoomed(false);
        // Wait for zoom out slightly, then flip back
        setTimeout(() => {
            setAnimState('resetting');
            // Set to idle after animation duration (1.2s)
            setTimeout(() => {
                setAnimState('idle');
            }, 1200);
        }, 300);
    };

    // Determine animation class
    let animationClass = 'animate-float';
    if (animState === 'flipping') animationClass = 'animate-flip-reveal';
    else if (animState === 'flipped') animationClass = 'animate-flip-reveal'; // Keeps it at final state due to 'forwards'
    else if (animState === 'resetting') animationClass = 'animate-flip-reset';

    return (
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)]"></div>

            {/* 3D Stage */}
            <div
                className={`relative perspective-1000 z-10 transition-all duration-[1000ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isZoomed
                        ? 'w-full h-[calc(100vh-2rem)] max-w-lg'
                        : 'w-[300px] h-[520px] sm:w-[320px] sm:h-[560px]'
                    }`}
            >

                {/* The Card Object */}
                <div
                    className={`relative w-full h-full preserve-3d ${animationClass}`}
                >
                    {/* Back */}
                    <CardBack onTap={handleReveal} />

                    {/* Front */}
                    <CardFront onFlipBack={handleFlipBack} />

                </div>

                {/* Shadow */}
                <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-3 bg-black/80 blur-xl rounded-[100%] transition-all duration-[1200ms] ${isZoomed
                        ? 'opacity-0 scale-150 translate-y-20'
                        : (animState === 'flipping' || animState === 'flipped' ? 'opacity-20 scale-50' : 'opacity-20 scale-75 animate-pulse')
                    }`}></div>

            </div>
        </div>
    );
};

export default CardPage;
