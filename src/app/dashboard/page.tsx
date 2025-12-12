"use client";

import React from "react";
import Link from "next/link";
import { useUserProfile } from "@/context/UserProfileContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { BottomNav } from "@/components/layout/BottomNav";
import { Settings, Home, Camera, User, Twitter, Linkedin, Wallet, ScanLine, Activity } from "lucide-react";

export default function DashboardPage() {
    const { profile } = useUserProfile();

    // Mock data for the graph
    const scanData = [45, 60, 75, 50, 80, 85]; // Last 6 months
    const maxScans = Math.max(...scanData);

    return (
        <main className="h-screen w-screen bg-background p-4 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto overflow-hidden">

            {/* Main Profile Column */}
            <section className="flex-1 flex flex-col max-w-md mx-auto w-full h-full justify-between pb-2">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center shrink-0 pt-4">
                    <div className="flex justify-end w-full mb-4 px-2 text-neu-text-light">
                        <Link href="/settings" className="flex items-center gap-2 hover:text-neu-accent-start transition-colors">
                            <Settings size={20} />
                            <span className="text-sm">Settings</span>
                        </Link>
                    </div>


                    <h2 className="text-xl font-bold text-neu-text-dark tracking-wider mb-2 uppercase">
                        {profile.companyName || "COMPANY NAME"}
                    </h2>

                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full neumorph-out p-1 flex items-center justify-center">
                            <img
                                src={profile.avatarUrl || "https://i.pravatar.cc/150"}
                                alt={profile.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-neu-text-dark mb-1">{profile.name || "User Name"}</h1>
                    <p className="text-neu-text-light text-sm">{profile.position || "Position"}</p>
                </div>

                {/* Content Container - Distribute space evenly */}
                <div className="flex-1 flex flex-col justify-evenly w-full gap-4 py-4">

                    {/* Grid Row */}
                    <div className="grid grid-cols-2 gap-4 shrink-0 px-2">
                        {/* Card A: Share Profile */}
                        <Card className="flex flex-col items-center text-center gap-2 justify-center py-6 h-full">
                            <h3 className="font-semibold text-neu-text-dark text-xs">Share Profile</h3>
                            <div className="w-24 h-24">
                                <QRCodeGenerator imageUrl={profile.qrCodeImageUrl} />
                            </div>
                        </Card>

                        {/* Card B: Scan QR */}
                        <Card className="flex flex-col items-center justify-between gap-2 py-6 h-full relative overflow-hidden group">
                            <div className="flex flex-col items-center gap-2">
                                <h3 className="font-semibold text-neu-text-dark text-xs">Scan Viewer</h3>
                                <div className="w-14 h-14 border-2 border-neu-text-light/30 rounded-lg flex items-center justify-center relative bg-background">
                                    <Camera size={24} className="text-neu-text-light" />
                                    <div className="absolute w-full h-0.5 bg-neu-accent-start top-1/2 -translate-y-1/2 animate-pulse" />
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-bold text-neu-text-dark leading-none">{profile.qrScanCount || 0}</span>
                                <span className="text-[10px] text-neu-text-light">Total Scans</span>
                            </div>
                        </Card>
                    </div>

                    {/* Timeline Graph Card */}
                    <Card className="w-full p-6 flex flex-col gap-4 shrink-0 mx-auto">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="font-semibold text-neu-text-dark text-xs flex items-center gap-2">
                                    <Activity size={16} className="text-neu-accent-start" /> Activity
                                </h3>
                                <p className="text-[10px] text-neu-text-light">Last 6 Months</p>
                            </div>
                            <span className="text-sm font-bold text-neu-accent-start">+12%</span>
                        </div>

                        <div className="h-28 w-full flex items-end justify-between px-2 gap-3 mt-2">
                            {scanData.map((value, index) => (
                                <div key={index} className="flex flex-col items-center gap-1 flex-1">
                                    <div
                                        className="w-full bg-neu-shadow rounded-t-sm relative group transition-all duration-500 hover:bg-neu-accent-start"
                                        style={{ height: `${(value / maxScans) * 100}%` }}
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-neu-text-dark text-white px-1.5 py-0.5 rounded">
                                            {value}
                                        </div>
                                    </div>
                                    <span className="text-[8px] text-neu-text-light uppercase tracking-wider">
                                        {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Bottom Nav (Mobile Style) */}
                <BottomNav />

            </section>

            {/* Sidebar / Links Section (Desktop Right Column) */}
            <aside className="hidden md:flex flex-col gap-6 max-w-sm w-full h-full">
                <Card className="h-full flex flex-col gap-4 overflow-hidden">
                    <h3 className="text-xl font-bold text-neu-text-dark text-center mb-2">{profile.name}'s Links</h3>

                    <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                        {profile.twitterUrl && (
                            <a
                                href={profile.twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full neumorph-btn px-6 py-3 rounded-3xl font-medium flex items-center justify-start gap-4 neumorph-out text-neu-text-dark hover:text-neu-accent-start transition-colors"
                            >
                                <Twitter size={20} /> Twitter
                            </a>
                        )}
                        {profile.instagramUrl && (
                            <a
                                href={profile.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full neumorph-btn px-6 py-3 rounded-3xl font-medium flex items-center justify-start gap-4 neumorph-out text-neu-text-dark hover:text-neu-accent-start transition-colors"
                            >
                                <div className="w-5 h-5 rounded bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500" /> Instagram
                            </a>
                        )}
                        {profile.linkedinUrl && (
                            <a
                                href={profile.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full neumorph-btn px-6 py-3 rounded-3xl font-medium flex items-center justify-start gap-4 neumorph-out text-neu-text-dark hover:text-neu-accent-start transition-colors"
                            >
                                <Linkedin size={20} /> LinkedIn
                            </a>
                        )}
                        {profile.websiteUrl && (
                            <a
                                href={profile.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full neumorph-btn px-6 py-3 rounded-3xl font-medium flex items-center justify-start gap-4 neumorph-out text-neu-text-dark hover:text-neu-accent-start transition-colors"
                            >
                                <User size={20} /> Personal Website
                            </a>
                        )}
                    </div>
                </Card>
            </aside>

        </main>
    );
}
