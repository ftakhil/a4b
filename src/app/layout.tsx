import type { Metadata } from "next";
import { Poppins, Luxurious_Roman } from "next/font/google";
import { UserProfileProvider } from "@/context/UserProfileContext";
import "./globals.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
});

const luxurious = Luxurious_Roman({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-luxurious",
});

export const metadata: Metadata = {
    title: "Neumorphic Business Card",
    description: "Generate your digital business card",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${poppins.variable} ${luxurious.variable} font-sans bg-background`}>
                <UserProfileProvider>
                    {children}
                </UserProfileProvider>
            </body>
        </html>
    );
}
