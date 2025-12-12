"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/context/UserProfileContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { n8nService } from "@/services/n8n";

const steps = [
    { id: "personal", title: "Let's start with you" },
    { id: "company", title: "Tell us about your company" },
    { id: "chatbot", title: "Configure your AI Agent" },
    { id: "details", title: "A bit more detail" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const { profile, updateProfile } = useUserProfile();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Final Step - Submit to n8n
            setIsSubmitting(true);
            const success = await n8nService.submitOnboardingData(profile);

            // Note: We might want to show an error if it fails, but for now 
            // we proceed to dashboard to not block the user, or we could just log it.
            // Given the prompt "create such as the whole info is collected and send",
            // we'll attempt send and then redirect.

            if (!success) {
                console.warn("Background submission to n8n failed, proceeding anyway.");
            }

            setIsSubmitting(false);
            router.push("/dashboard");
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-lg min-h-[500px] flex flex-col justify-between relative overflow-hidden">

                {/* Progress Indicator */}
                <div className="flex justify-between mb-8 px-2">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="flex flex-col items-center gap-2">
                            <div className={`h-3 w-3 rounded-full transition-all duration-300 ${idx <= currentStep ? 'bg-neu-accent-start shadow-[0_0_10px_#4facfe]' : 'bg-neu-text-light/30'}`} />
                        </div>
                    ))}
                </div>

                <div className="flex-1 flex flex-col relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-6"
                        >
                            <h1 className="text-2xl font-bold text-neu-text-dark text-center mb-4">
                                {steps[currentStep].title}
                            </h1>

                            {currentStep === 0 && (
                                <>
                                    <div className="flex flex-col items-center mb-4">
                                        <div className="w-24 h-24 rounded-full neumorph-in flex items-center justify-center overflow-hidden mb-2 relative group cursor-pointer hover:opacity-80 transition-opacity">
                                            {profile.avatarUrl ? (
                                                <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl text-neu-text-light/50">+</span>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const url = URL.createObjectURL(file);
                                                        updateProfile({ avatarUrl: url });
                                                    }
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-neu-text-light">Upload Photo</span>
                                    </div>

                                    <Input
                                        label="What is your name?"
                                        placeholder="e.g. Emily Carter"
                                        value={profile.name}
                                        onChange={(e) => updateProfile({ name: e.target.value })}
                                    />
                                    <Input
                                        label="Position"
                                        placeholder="e.g. Lead Strategist"
                                        value={profile.position}
                                        onChange={(e) => updateProfile({ position: e.target.value })}
                                    />
                                    <Input
                                        label="Location"
                                        placeholder="e.g. San Francisco, CA"
                                        value={profile.location}
                                        onChange={(e) => updateProfile({ location: e.target.value })}
                                    />
                                </>
                            )}

                            {currentStep === 1 && (
                                <>
                                    <Input
                                        label="Company Name"
                                        placeholder="e.g. Aurora Solutions"
                                        value={profile.companyName}
                                        onChange={(e) => updateProfile({ companyName: e.target.value })}
                                    />
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="ml-4 text-sm font-medium text-neu-text-light">Category</label>
                                        <select
                                            className="neumorph-in px-6 py-4 outline-none focus:ring-2 focus:ring-neu-accent-start/20 transition-all w-full appearance-none bg-transparent"
                                            value={profile.category}
                                            onChange={(e) => updateProfile({ category: e.target.value })}
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
                                        label="Website URL"
                                        placeholder="https://"
                                        value={profile.websiteUrl}
                                        onChange={(e) => updateProfile({ websiteUrl: e.target.value })}
                                    />
                                </>
                            )}

                            {currentStep === 2 && (
                                <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 max-h-[60vh]">

                                    {/* Q1: Tone */}
                                    <div className="flex flex-col gap-3">
                                        <h3 className="font-luxurious text-lg text-neu-text-dark">1. Tone & Voice</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Professional', 'Friendly', 'Technical', 'Sales'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => updateProfile({ chatbotSettings: { ...profile.chatbotSettings, tone: opt } })}
                                                    className={`p-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${profile.chatbotSettings?.tone === opt
                                                        ? 'bg-neu-accent-start text-white border-neu-accent-start'
                                                        : 'bg-transparent text-neu-text-light border-neu-text-light/20 hover:border-neu-accent-start/50'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Q2: Primary Goal */}
                                    <div className="flex flex-col gap-3">
                                        <h3 className="font-luxurious text-lg text-neu-text-dark">2. Primary Goal</h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {['Customer Support', 'Lead Generation', 'Education/Trust'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => updateProfile({ chatbotSettings: { ...profile.chatbotSettings, goal: opt } })}
                                                    className={`p-3 rounded-xl text-left pl-4 text-xs font-bold uppercase tracking-wider transition-all border ${profile.chatbotSettings?.goal === opt
                                                        ? 'bg-neu-accent-start text-white border-neu-accent-start'
                                                        : 'bg-transparent text-neu-text-light border-neu-text-light/20 hover:border-neu-accent-start/50'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Q3: Unknown Handling */}
                                    <div className="flex flex-col gap-3">
                                        <h3 className="font-luxurious text-lg text-neu-text-dark">3. Unknown Questions</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Strict', 'Helpful', 'Smart Guess'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => updateProfile({ chatbotSettings: { ...profile.chatbotSettings, unknownHandler: opt } })}
                                                    className={`p-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all border ${profile.chatbotSettings?.unknownHandler === opt
                                                        ? 'bg-neu-accent-start text-white border-neu-accent-start'
                                                        : 'bg-transparent text-neu-text-light border-neu-text-light/20 hover:border-neu-accent-start/50'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Q4: Response Length */}
                                    <div className="flex flex-col gap-3">
                                        <h3 className="font-luxurious text-lg text-neu-text-dark">4. Response Length</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Concise', 'Standard', 'Detailed'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => updateProfile({ chatbotSettings: { ...profile.chatbotSettings, responseLength: opt } })}
                                                    className={`p-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all border ${profile.chatbotSettings?.responseLength === opt
                                                        ? 'bg-neu-accent-start text-white border-neu-accent-start'
                                                        : 'bg-transparent text-neu-text-light border-neu-text-light/20 hover:border-neu-accent-start/50'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Q5: Emoji Usage */}
                                    <div className="flex flex-col gap-3">
                                        <h3 className="font-luxurious text-lg text-neu-text-dark">5. Emojis</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['None', 'Minimal', 'Expressive'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => updateProfile({ chatbotSettings: { ...profile.chatbotSettings, emojiUsage: opt } })}
                                                    className={`p-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition-all border ${profile.chatbotSettings?.emojiUsage === opt
                                                        ? 'bg-neu-accent-start text-white border-neu-accent-start'
                                                        : 'bg-transparent text-neu-text-light border-neu-text-light/20 hover:border-neu-accent-start/50'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            )}

                            {currentStep === 3 && (
                                <>
                                    <Input
                                        label="LinkedIn URL"
                                        placeholder="https://linkedin.com/in/..."
                                        value={profile.linkedinUrl}
                                        onChange={(e) => updateProfile({ linkedinUrl: e.target.value })}
                                    />
                                    <Input
                                        label="Monthly Recurring Revenue (MRR)"
                                        placeholder="e.g. $50k"
                                        value={profile.mrr}
                                        onChange={(e) => updateProfile({ mrr: e.target.value })}
                                    />
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="ml-4 text-sm font-medium text-neu-text-light">Primary Problem You Solve</label>
                                        <textarea
                                            className="neumorph-in px-6 py-4 outline-none focus:ring-2 focus:ring-neu-accent-start/20 transition-all w-full resize-none h-32 bg-transparent border-none"
                                            placeholder="In a few words..."
                                            value={profile.problemSolved}
                                            onChange={(e) => updateProfile({ problemSolved: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex gap-4 mt-8">
                    {currentStep > 0 && (
                        <Button variant="secondary" onClick={handleBack} className="flex-1" disabled={isSubmitting}>
                            Back
                        </Button>
                    )}
                    <Button onClick={handleNext} className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                Sending...
                            </span>
                        ) : (
                            currentStep === steps.length - 1 ? "Complete" : "Next"
                        )}
                    </Button>
                </div>

            </Card>
        </main >
    );
}
