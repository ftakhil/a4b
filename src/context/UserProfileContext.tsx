"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DatabaseProfile } from "@/types/supabase";

export interface UserProfile {
    id?: string;
    userId?: string; // Optional linkage to auth system if used
    email?: string;
    password?: string; // Storing temporarily for onboarding submission
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
    refreshProfile: () => Promise<void>;
    manualLogin: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
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

    const refreshProfile = React.useCallback(async () => {
        // 1. Check for Custom Auth (Local Storage)
        let customId = typeof window !== 'undefined' ? localStorage.getItem("custom_user_id") : null;

        let queryBuilder = supabase.from('company_profiles').select('*');

        if (customId) {
            console.log("Fetching profile for custom user ID:", customId);
            queryBuilder = queryBuilder.eq('id', customId); // Assuming custom_user_id IS the profile ID
        } else {
            // Check Supabase Auth as fallback
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
                queryBuilder = queryBuilder.eq('user_id', session.user.id);
            } else {
                // No user found
                const saved = localStorage.getItem("userProfile");
                if (saved) {
                    try { setProfile(JSON.parse(saved)); } catch (e) { console.error(e); }
                }
                setIsHydrated(true);
                return;
            }
        }

        const { data, error } = await queryBuilder.single<DatabaseProfile>();

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
                // Do not load password back
            }));
            localStorage.setItem("userProfile", JSON.stringify(data));
        } else if (error) {
            console.warn("Fetch Error:", error.message);
        }

        setIsHydrated(true);
    }, []);

    const manualLogin = async (email: string, pass: string): Promise<boolean> => {
        // Direct Query: Check if email & password match a row
        // Note: Password must be stored in plaintext or we need the same hash logic. 
        // Assuming plaintext based on user request.

        const { data, error } = await supabase
            .from('company_profiles')
            .select('*')
            .eq('email', email) // Assuming these columns exist as requested
            .eq('password', pass)
            .single();

        if (data) {
            // Login Success
            localStorage.setItem("custom_user_id", data.id);
            await refreshProfile();
            return true;
        } else {
            console.error("Login failed:", error?.message || "Invalid credentials");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("custom_user_id");
        localStorage.removeItem("userProfile");
        setProfile(defaultProfile);
        supabase.auth.signOut(); // Just in case
    };

    useEffect(() => {
        refreshProfile();

        // Keep auth listener just in case they revert
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                refreshProfile();
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [refreshProfile]);

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
            // Do not save password to localstorage if possible, but for dev it's ok
            localStorage.setItem("userProfile", JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <UserProfileContext.Provider value={{ profile, updateProfile, isHydrated, refreshProfile, manualLogin, logout }}>
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
