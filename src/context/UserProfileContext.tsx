"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DatabaseProfile } from "@/types/supabase";

export interface UserProfile {
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
        const fetchProfile = async () => {
            // Load from local storage first to get the key (e.g. name or just use what we have)
            const saved = localStorage.getItem("userProfile");
            let localProfile = defaultProfile;

            if (saved) {
                try {
                    localProfile = JSON.parse(saved);
                    setProfile(localProfile);
                } catch (e) {
                    console.error("Failed to parse local profile", e);
                }
            }

            // Sync with Supabase
            // We'll try to match by name if available, or maybe email if we had it.
            // For this demo, let's assume we want the *latest* profile if we don't have a specific match,
            // OR if we have a name, match that. 
            // The user said "n8n takes the details", so we want to read what n8n wrote.

            if (localProfile.name) {
                const { data, error } = await supabase
                    .from('company_profiles')
                    .select('*')
                    .ilike('owner_name', localProfile.name) // Case insensitive match
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single<DatabaseProfile>();

                if (data) {
                    console.log("Supabase Profile Found:", data);
                    // Map DB to State
                    setProfile(prev => ({
                        ...prev,
                        name: data.owner_name || prev.name,
                        companyName: data.company_name || prev.companyName,
                        position: data.owner_role || prev.position,
                        problemSolved: data.brief_description || prev.problemSolved,
                        websiteUrl: data.website_url || prev.websiteUrl,
                        linkedinUrl: data.linkedin_url || prev.linkedinUrl,
                        avatarUrl: data.owner_photo_url || prev.avatarUrl,
                        qrScanCount: data.qr_scan_count || 0,
                        qrCodeImageUrl: data.qr_code_image_url || prev.qrCodeImageUrl,
                        twitterUrl: data.twitter_url || prev.twitterUrl,
                        instagramUrl: data.instagram_url || prev.instagramUrl,
                        facebookUrl: data.facebook_url || prev.facebookUrl,
                        youtubeUrl: data.youtube_url || prev.youtubeUrl,
                        tiktokUrl: data.tiktok_url || prev.tiktokUrl,
                        // We can also sync other fields if we add them to interface
                    }));
                } else if (error) {
                    console.warn("Supabase Fetch Error:", error.message);
                }
            }

            setIsHydrated(true);
        };

        fetchProfile();
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
