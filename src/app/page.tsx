"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push("/onboarding");
    }, [router]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-background">
            <div className="neumorph-out p-8 rounded-full animate-pulse">
                <span className="text-neu-text-light">Loading...</span>
            </div>
        </main>
    );
}
