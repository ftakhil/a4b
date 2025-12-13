"use client";

import React, { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Redirect to dashboard or specific URL
            const redirectUrl = searchParams.get('redirect') || '/dashboard';
            router.push(redirectUrl);
        } catch (error: any) {
            setError(error.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)]" />

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-8 left-8 p-3 rounded-xl neumorph-out text-neu-text-light hover:text-neu-accent-start transition-colors z-20"
            >
                <ArrowLeft size={20} />
            </button>

            <div className="z-10 w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neu-text-dark font-sans tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-neu-text-light text-sm">Enter your credentials to access your card.</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    {/* Error Message */}
                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="neumorph-in rounded-2xl p-1 flex items-center">
                        <div className="p-4 text-neu-text-light">
                            <Mail size={20} />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            required
                            className="bg-transparent w-full p-4 text-neu-text-dark placeholder-neu-text-light/50 outline-none font-sans"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="neumorph-in rounded-2xl p-1 flex items-center">
                        <div className="p-4 text-neu-text-light">
                            <Lock size={20} />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="bg-transparent w-full p-4 text-neu-text-dark placeholder-neu-text-light/50 outline-none font-sans"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 font-bold tracking-widest text-neu-text-dark uppercase rounded-2xl neumorph-btn hover:text-neu-accent-start transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Login"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-neu-text-light text-sm">
                        Don't have an account?{' '}
                        <button onClick={() => router.push('/onboarding')} className="text-neu-accent-start hover:underline">
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
