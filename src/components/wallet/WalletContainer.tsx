"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import BusinessCard from './BusinessCard';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from "@/components/layout/BottomNav";
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

// Step 1: Dummy Data
const DUMMY_CARDS = [
    { id: 1, company: 'Monolith Corp', owner: 'Alex Mercer', role: 'Chief Executive' },
    { id: 2, company: 'Vanguard Systems', owner: 'Sarah Connor', role: 'Tech Lead' },
    { id: 3, company: 'Apex Dynamics', owner: 'John Wick', role: 'Security Consultant' },
    { id: 4, company: 'Nebula Innovations', owner: 'Ellen Ripley', role: 'Operations' },
    { id: 5, company: 'Cyberdyne', owner: 'Miles Dyson', role: 'Lead Researcher' },
    { id: 6, company: 'Tyrell Corp', owner: 'Eldon Tyrell', role: 'Founder' },
];

// Card Wrapper Component to handle individual card physics
const CardWrapper = ({
    card,
    index,
    total,
    scrollYProgress,
    isActive,
    onClick
}: {
    card: any,
    index: number,
    total: number,
    scrollYProgress: MotionValue<number>,
    isActive: boolean,
    onClick: () => void
}) => {
    // Logic:
    // Cards start "off screen" or lower down.
    // As scrollYProgress increases (0 to 1), they move UP to their stacked position.

    // Calculate the 'trigger' point for this card.
    const step = 1 / total;
    const start = index * step * 0.5; // Overlap properly
    const end = start + 0.4; // Duration of 'entry'

    // Y Position:
    // Reverted to start from bottom (1000px) as requested.
    const yInputRange = [start, end];
    const yOutputRange = [1000, index * 60];
    const rawY = useTransform(scrollYProgress, yInputRange, yOutputRange);

    // Physics Spring
    const y = useSpring(rawY, { stiffness: 100, damping: 20, mass: 1 });

    // Scale
    const scaleInputRange = [start, end];
    const scaleOutputRange = [0.9, 1];
    const rawScale = useTransform(scrollYProgress, scaleInputRange, scaleOutputRange);
    const scale = useSpring(rawScale, { stiffness: 100, damping: 20 });

    // Opacity
    // Reverted to standard fade-in since we are auto-scrolling to make it visible
    const opacityInputRange = [start, start + 0.1];
    const opacity = useTransform(scrollYProgress, opacityInputRange, [0, 1]);

    // Z-Index: Ascending. Newer cards (higher index) are ON TOP.
    // Card 0 = z-index 10
    // Card 1 = z-index 11 (Covers Card 0)
    const zIndex = isActive ? 100 : 10 + index;

    return (
        <motion.div
            style={{
                y: isActive ? 0 : y,
                // Positive Z translation ensures they are physically closer to the camera
                // reinforcing the z-index stacking.
                z: isActive ? 100 : index * 40,
                scale: isActive ? 1.05 : scale,
                opacity: opacity,
                zIndex: zIndex,
            }}
            className="absolute left-0 right-0 mx-auto w-[340px] h-[215px]"
        >
            <BusinessCard
                index={index}
                data={card}
                isActive={isActive}
                onClick={onClick}
                style={{
                    // Pass empty transform so the motion.div controls it
                    transform: 'none',
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                }}
            />
        </motion.div>
    );
}

const WalletContainer: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Auto-Scroll on Mount
    // "the first card should be displayed in the middle like i have done a half scroll"
    useEffect(() => {
        // Disable browser scroll restoration to ensure our manual scroll works
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Scroll slightly down to trigger the entry animation for the first card
        // 600px is roughly 20% of the 300vh height, triggering the first card's range (0-0.4)
        window.scrollTo({ top: 600, behavior: 'smooth' });

    }, []);

    const handleCardClick = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div
            ref={containerRef}
            className="w-full relative bg-background"
            style={{ height: '300vh' }} // Increased height for more scroll room
        >
            {/* Fixed Background Layer */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    background: 'radial-gradient(circle at center, #2e2e2e 0%, #0a0a0a 70%)',
                    backgroundColor: '#0a0a0a',
                }}
            />

            {/* Sticky Stage - Adjusted for Top Alignment */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-start pt-32 overflow-hidden z-10 perspective-container">



                {/* Search Bar Placeholder */}
                <div className="absolute top-20 w-full max-w-sm px-4 z-40">
                    <div className="w-full h-10 bg-white/5 rounded-full border border-white/10 flex items-center px-4 text-white/30 text-sm backdrop-blur-sm">
                        Search Cards...
                    </div>
                </div>

                <div className="relative w-full max-w-sm h-[800px] flex justify-center" style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
                    {DUMMY_CARDS.map((card, i) => (
                        <CardWrapper
                            key={card.id}
                            card={card}
                            index={i}
                            total={DUMMY_CARDS.length}
                            scrollYProgress={scrollYProgress}
                            isActive={activeIndex === i}
                            onClick={() => handleCardClick(i)}
                        />
                    ))}
                </div>

                <div className="absolute bottom-2 w-full max-w-md px-4 z-50">
                    <BottomNav />
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
                    className="absolute bottom-24 text-neu-text-light text-xs animate-bounce"
                >
                    Scroll
                </motion.div>

            </div>
        </div>
    );
};

export default WalletContainer;
