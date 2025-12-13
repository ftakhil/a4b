"use client";

import { useRouter } from "next/navigation";
import React from "react";
import CardBack from "./card/components/CardBack";

export default function Home() {
    const router = useRouter();

    return (
        <main className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)]"></div>

            {/* Floating 3D Card Container */}
            <div className="relative z-10 w-[300px] h-[520px] mb-12 animate-float perspective-1000">
                <div className="relative w-full h-full preserve-3d">
                    {/* We reuse CardBack as the decorative element. 
                        No tap action needed here, or could trigger a fun little flip. */}
                    <CardBack onTap={() => { }} />
                </div>

                {/* Shadow */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-3 bg-black/80 blur-xl rounded-[100%] opacity-40 animate-pulse"></div>
            </div>

            {/* Auth Options */}
            <div className="z-20 flex flex-col w-full max-w-xs gap-4 animate-fade-in-up">
                <button
                    onClick={() => router.push('/login')}
                    className="w-full py-4 text-sm font-bold tracking-widest text-neu-text-dark uppercase rounded-2xl neumorph-btn hover:text-neu-accent-start transition-all"
                >
                    Login
                </button>

                <button
                    onClick={() => router.push('/onboarding')}
                    className="w-full py-4 text-sm font-bold tracking-widest text-neu-text-dark uppercase rounded-2xl neumorph-out hover:neumorph-in transition-all opacity-80 hover:opacity-100"
                >
                    Sign Up
                </button>
            </div>

        </main>
    );
}
