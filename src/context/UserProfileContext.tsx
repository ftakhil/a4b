"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DatabaseProfile } from "@/types/supabase";

export interface UserProfile {
    id?: string;
    name: string;
    companyName: string;
    category: string;
    position: string;
    linkedinUrl: string;
    problemSolved: string;
    websiteUrl: string;
    mrr: string;
    location: string;
    avatarUrl: string; // Placeholder for now
    qrScanCount?: number;
    qrCodeImageUrl?: string;
    profileSlug?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    youtubeUrl?: string;
    tiktokUrl?: string;
    chatbotSettings: {
        tone: string;
        goal: string;
        unknownHandler: string;
        responseLength: string;
        emojiUsage: string;
    };
}

interface UserProfileContextType {
    profile: UserProfile;
    updateProfile: (data: Partial<UserProfile>) => void;
    isHydrated: boolean;
}

const defaultProfile: UserProfile = {
    id: "",
    name: "",
    companyName: "",
    category: "",
    position: "",
    linkedinUrl: "",
    problemSolved: "",
    websiteUrl: "",
    mrr: "",
    location: "",
    avatarUrl: "", // Will use a default if empty
    qrScanCount: 0,
    qrCodeImageUrl: "",
    profileSlug: "",
    twitterUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
    chatbotSettings: {
        tone: "",
        goal: "",
        unknownHandler: "",
        responseLength: "",
        emojiUsage: "",
    }
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile>(defaultProfile);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const fetchProfile = async (userId?: string) => {
            // If no userId provided, try to get from session
            if (!userId) {
                const { data: { session } } = await supabase.auth.getSession();
                userId = session?.user?.id;
            }

            if (!userId) {
                // Determine if we should clear profile or load from local storage
                const saved = localStorage.getItem("userProfile");
                if (saved) {
                    try {
                        setProfile(JSON.parse(saved));
                    } catch (e) { console.error(e); }
                }
                setIsHydrated(true);
                return;
            }

            console.log("Fetching profile for user:", userId);

            // Fetch from Supabase using user_id
            const { data, error } = await supabase
                .from('company_profiles')
                .select('*')
                .eq('user_id', userId)
                .single<DatabaseProfile>();

            if (data) {
                setProfile(prev => ({
                    ...prev,
                    id: data.id,
                    name: data.owner_name || prev.name,
                    companyName: data.company_name || prev.companyName,
                    position: data.owner_role || prev.position,
                    problemSolved: data.brief_description || prev.problemSolved,
                    websiteUrl: data.website_url || prev.websiteUrl,
                    linkedinUrl: data.linkedin_url || prev.linkedinUrl,
                    avatarUrl: data.owner_photo_url || prev.avatarUrl,
                    qrScanCount: data.qr_scan_count || 0,
                    qrCodeImageUrl: data.qr_code_image_url || prev.qrCodeImageUrl,
                    profileSlug: data.profile_slug,
                    twitterUrl: data.twitter_url || prev.twitterUrl,
                    instagramUrl: data.instagram_url || prev.instagramUrl,
                    facebookUrl: data.facebook_url || prev.facebookUrl,
                    youtubeUrl: data.youtube_url || prev.youtubeUrl,
                    tiktokUrl: data.tiktok_url || prev.tiktokUrl,
                }));
                // Update local storage to match cloud
                localStorage.setItem("userProfile", JSON.stringify(data));
            } else if (error) {
                console.warn("Supabase Fetch Error:", error.message);
            }

            setIsHydrated(true);
        };

        fetchProfile();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                fetchProfile(session.user.id);
            } else if (event === 'SIGNED_OUT') {
                setProfile(defaultProfile);
                localStorage.removeItem("userProfile");
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const updateProfile = (data: Partial<UserProfile>) => {
        setProfile((prev) => {
            // Handle nested merge for chatbotSettings if present
            let updatedSettings = prev.chatbotSettings;
            if (data.chatbotSettings) {
                updatedSettings = { ...prev.chatbotSettings, ...data.chatbotSettings };
            }

            const updated = {
                ...prev,
                ...data,
                chatbotSettings: data.chatbotSettings ? updatedSettings : prev.chatbotSettings
            };
            localStorage.setItem("userProfile", JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <UserProfileContext.Provider value={{ profile, updateProfile, isHydrated }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error("useUserProfile must be used within a UserProfileProvider");
    }
    return context;
};
