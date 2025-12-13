"use client";
import React from 'react';
import MonolithChat from './MonolithChat';
import CompanyFlashcard from './CompanyFlashcard';
import { DatabaseProfile } from '@/types/supabase';
import { Wallet, Check, Loader2 } from 'lucide-react';
import { walletService } from '@/services/walletService';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface CardFrontProps {
    onFlipBack?: () => void;
    profile: DatabaseProfile | null;
    loading?: boolean;
}

const CardFront: React.FC<CardFrontProps> = ({ onFlipBack, profile, loading }) => {
    const router = useRouter();
    const [saved, setSaved] = React.useState(false);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        if (profile?.id) {
            walletService.isSaved(profile.id).then(setSaved);
        }
    }, [profile]);

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!profile?.id) return;
        setSaving(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Redirect to login with return URL
                const currentPath = window.location.pathname + window.location.search;
                router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
                return;
            }

            const result = await walletService.addToWallet(profile.id);
            if (result.error === 'already_saved') {
                setSaved(true);
            } else if (result.data) {
                setSaved(true);
            }
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="absolute inset-0 w-full h-full rounded-[20px] bg-matte-black noise-bg shadow-soft-glow overflow-hidden flex flex-col backface-hidden rotate-y-180 border border-white/5 p-6">

            {/* 1. Header Section - Centered & Larger */}
            <div className="relative flex justify-center items-center mb-8">
                <h1 className="font-sans font-bold text-3xl text-text tracking-tight text-center w-full truncate px-8">
                    {loading ? "Loading..." : (profile?.company_name || "Company Name")}
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
                            src={profile?.owner_photo_url || "https://picsum.photos/id/1005/200/200"}
                            alt={profile?.owner_name || "User"}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                    </div>

                    {/* Text Info */}
                    <div className="flex flex-col min-w-0">
                        <h2 className="font-sans font-bold text-base text-text leading-tight truncate">
                            {profile?.owner_name || "User Name"}
                        </h2>
                        <p className="font-sans text-[10px] font-medium text-text-muted uppercase tracking-wider mt-0.5 truncate">
                            {profile?.owner_role || "Role"}
                        </p>
                    </div>

                    {/* Actions Row */}
                    <div className="ml-auto flex items-center gap-2">
                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={saved || saving}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all group/btn shrink-0 ${saved
                                ? "bg-neu-accent-start/10 border-neu-accent-start/50 text-neu-accent-start"
                                : "bg-surface-highlight border-white/10 hover:bg-white/10 text-text-muted hover:text-text"
                                }`}
                        >
                            {saving ? (
                                <Loader2 size={12} className="animate-spin" />
                            ) : saved ? (
                                <Check size={12} />
                            ) : (
                                <Wallet size={12} />
                            )}
                            <span className="text-[10px] font-medium">
                                {saved ? "Saved" : "Save"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col space-y-4 mt-2 min-h-0 overflow-hidden">

                {/* 3. Flashcard (Vision) - Larger & Glowing */}
                <div className="shrink-0">
                    <CompanyFlashcard
                        description={profile?.brief_description}
                        companyName={profile?.company_name}
                    />
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
