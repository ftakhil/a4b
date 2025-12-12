"use client";
import React from 'react';

interface CompanyFlashcardProps {
    description?: string;
    companyName?: string;
}

const CompanyFlashcard: React.FC<CompanyFlashcardProps> = ({ description, companyName }) => (
    <div className="relative w-full p-6 rounded-xl bg-surface animate-breathe-glow overflow-hidden group hover:bg-surface-highlight transition-colors duration-300">

        <div className="relative z-10 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-sans font-bold text-sm text-text">{companyName || "A2B Vision"}</h3>
                <span className="text-[10px] text-text-muted font-sans font-semibold bg-white/5 px-2 py-0.5 rounded">{new Date().getFullYear()}</span>
            </div>

            <p className="font-sans text-sm text-text-muted leading-relaxed line-clamp-3">
                {description || "Synthesizing sentient AI with global infrastructure. Orchestrating the future with absolute precision."}
            </p>
        </div>
    </div>
);

export default CompanyFlashcard;
