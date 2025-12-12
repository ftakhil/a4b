"use client";
import React from 'react';
import MonolithChat from './MonolithChat';
import CompanyFlashcard from './CompanyFlashcard';

interface CardFrontProps {
    onFlipBack?: () => void;
}

const CardFront: React.FC<CardFrontProps> = ({ onFlipBack }) => {
    return (
        <div className="absolute inset-0 w-full h-full rounded-[20px] bg-matte-black noise-bg shadow-soft-glow overflow-hidden flex flex-col backface-hidden rotate-y-180 border border-white/5 p-6">

            {/* 1. Header Section - Centered & Larger */}
            <div className="relative flex justify-center items-center mb-8">
                <h1 className="font-sans font-bold text-3xl text-text tracking-tight text-center w-full">
                    Monolith Corp
                </h1>

                {/* Flip Back Button (Top Right) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onFlipBack?.();
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-surface/50 border border-white/5 text-text-muted hover:text-text hover:bg-surface-highlight transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                        <path d="M16 21h5v-5" />
                    </svg>
                </button>
            </div>

            {/* 2. Profile Section */}
            <div className="relative mb-5 group px-2">
                <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-highlight border border-white/5 shrink-0">
                        <img
                            src="https://picsum.photos/id/1005/200/200"
                            alt="Alex Mercer"
                            className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                    </div>

                    {/* Text Info */}
                    <div className="flex flex-col">
                        <h2 className="font-sans font-bold text-base text-text leading-tight">Alex Mercer</h2>
                        <p className="font-sans text-[10px] font-medium text-text-muted uppercase tracking-wider mt-0.5">
                            Chief Executive
                        </p>
                    </div>

                    {/* Social Media Button - Styled like reference pill */}
                    <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-highlight border border-white/10 hover:bg-white/10 transition-colors group/btn shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted group-hover/btn:text-text transition-colors">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        <span className="text-[10px] font-medium text-text-muted group-hover/btn:text-text transition-colors">Social Media</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col space-y-4 mt-2 min-h-0 overflow-hidden">

                {/* 3. Flashcard (Vision) - Larger & Glowing */}
                <div className="shrink-0">
                    <CompanyFlashcard />
                </div>

                {/* 4. Chat Interface */}
                <div className="flex-1 relative rounded-xl bg-surface border border-white/5 overflow-hidden shadow-inner flex flex-col">
                    <MonolithChat />
                </div>

            </div>
        </div>
    );
};

export default CardFront;
