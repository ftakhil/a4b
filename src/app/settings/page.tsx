"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/context/UserProfileContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Camera } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";

export default function SettingsPage() {
    const router = useRouter();
    const { profile, updateProfile, isHydrated } = useUserProfile();

    // Local state for form handling to avoid jittery updates or just direct context update?
    // Direct context update is fine for this scale, but let's use local state for "Save" behavior or just direct auto-save?
    // User asked to "edit details", usually implies a Save action. But our context updates immediately. 
    // Let's stick to direct updates for simplicity + "Save & Exit" button.

    const [formData, setFormData] = useState(profile);

    useEffect(() => {
        if (isHydrated) {
            setFormData(profile);
        }
    }, [profile, isHydrated]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        updateProfile(formData);
        router.back();
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (limit to 2MB to be safe for localStorage)
            if (file.size > 2 * 1024 * 1024) {
                alert("File is too large. Please choose an image under 2MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, avatarUrl: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isHydrated) return null;

    return (
        <main className="min-h-screen bg-background p-4 md:p-8 flex justify-center pb-20">
            <div className="w-full max-w-lg h-full flex flex-col gap-6 relative">

                <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => router.back()} className="neumorph-btn p-2 rounded-full text-neu-text-dark">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-neu-text-dark">Settings</h1>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-6">

                    {/* Photo Edit */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full neumorph-in flex items-center justify-center overflow-hidden mb-2 relative group cursor-pointer">
                            {formData.avatarUrl ? (
                                <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <Camera size={32} className="text-neu-text-light" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handlePhotoUpload}
                            />
                        </div>
                        <span className="text-sm text-neu-text-light">Tap to change photo</span>
                    </div>

                    <section className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-neu-text-dark border-b border-neu-text-light/10 pb-2">Personal Info</h2>
                        <Input
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                        <Input
                            label="Position"
                            value={formData.position}
                            onChange={(e) => handleChange('position', e.target.value)}
                        />
                        <Input
                            label="Location"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                        />
                    </section>

                    <section className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-neu-text-dark border-b border-neu-text-light/10 pb-2">Company Info</h2>
                        <Input
                            label="Company Name"
                            value={formData.companyName}
                            onChange={(e) => handleChange('companyName', e.target.value)}
                        />
                        <div className="flex flex-col gap-2 w-full">
                            <label className="ml-4 text-sm font-medium text-neu-text-light">Category</label>
                            <select
                                className="neumorph-in px-6 py-4 outline-none focus:ring-2 focus:ring-neu-accent-start/20 transition-all w-full appearance-none bg-transparent"
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                            >
                                <option value="" className="bg-background text-neu-text-dark">Select Category</option>
                                <option value="SaaS" className="bg-background text-neu-text-dark">SaaS</option>
                                <option value="Agency" className="bg-background text-neu-text-dark">Agency</option>
                                <option value="Non-profit" className="bg-background text-neu-text-dark">Non-profit</option>
                                <option value="E-commerce" className="bg-background text-neu-text-dark">E-commerce</option>
                                <option value="Other" className="bg-background text-neu-text-dark">Other</option>
                            </select>
                        </div>
                        <Input
                            label="Website"
                            value={formData.websiteUrl}
                            onChange={(e) => handleChange('websiteUrl', e.target.value)}
                        />
                        <Input
                            label="MRR"
                            value={formData.mrr}
                            onChange={(e) => handleChange('mrr', e.target.value)}
                        />
                        <div className="flex flex-col gap-2 w-full">
                            <label className="ml-4 text-sm font-medium text-neu-text-light">Problem Solved</label>
                            <textarea
                                className="neumorph-in px-6 py-4 outline-none focus:ring-2 focus:ring-neu-accent-start/20 transition-all w-full resize-none h-24 bg-transparent border-none text-neu-text-dark"
                                value={formData.problemSolved}
                                onChange={(e) => handleChange('problemSolved', e.target.value)}
                            />
                        </div>
                    </section>

                    <section className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold text-neu-text-dark border-b border-neu-text-light/10 pb-2">Socials</h2>
                        <Input
                            label="LinkedIn URL"
                            value={formData.linkedinUrl}
                            onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                        />
                    </section>
                </div>

                <Button onClick={handleSave} className="w-full mt-4">
                    Save Changes
                </Button>

            </div>

            <div className="fixed bottom-2 w-full max-w-md px-4 z-50 md:hidden">
                <BottomNav />
            </div>
        </main>
    );
}
