"use client";
import React from 'react';
import Link from 'next/link';
import { Home, ScanLine, Wallet, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUserProfile } from '@/context/UserProfileContext';

export const BottomNav = () => {
    const pathname = usePathname();
    const { profile } = useUserProfile();

    const isActive = (path: string) => pathname === path;

    const baseIconClass = "p-2 transition-transform active:scale-95 duration-300 rounded-xl";
    const activeClass = "text-neu-accent-start bg-white/5 shadow-[0_0_15px_rgba(79,172,254,0.3)]";
    const inactiveClass = "text-neu-text-light hover:text-neu-accent-start";

    // Construct card URL: /card/[slug]?id=[id]&c=[company]
    const cardSlug = profile.profileSlug || 'my-card';
    const cardId = profile.id || '';
    const company = profile.companyName ? encodeURIComponent(profile.companyName) : '';

    // Fallback URL if info is missing, but try to be as complete as possible
    const cardLink = `/card/${cardSlug}?id=${cardId}&c=${company}`;

    return (
        <div className="neumorph-out p-2 rounded-2xl flex justify-between px-6 shrink-0 mx-4 md:hidden relative z-50">
            <Link href="/dashboard" className={`${baseIconClass} ${isActive('/dashboard') ? activeClass : inactiveClass}`}>
                <Home size={24} />
            </Link>

            {/* Link to dynamic card page */}
            <Link href={cardLink} className={`${baseIconClass} ${pathname.startsWith('/card') ? activeClass : inactiveClass}`}>
                <ScanLine size={24} />
            </Link>

            <Link href="/wallet" className={`${baseIconClass} ${isActive('/wallet') ? activeClass : inactiveClass}`}>
                <Wallet size={24} />
            </Link>

            <Link href="/settings" className={`${baseIconClass} ${isActive('/settings') ? activeClass : inactiveClass}`}>
                <Settings size={24} />
            </Link>
        </div>
    );
};
