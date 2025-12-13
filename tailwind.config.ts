import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0a0a0a", // Deep Matte Black
                "plat-dark": "#1a1a1a",
                "plat-light": "#2b2b2b",
                "neu-white": "#1a1a1a",
                "neu-shadow": "#404040", // Lightened for visibility on dark cards (Graph empty state)
                "neu-text-dark": "#ecf0f1", // Platinum White
                "neu-text-light": "#94a3b8", // Slate 400
                "neu-accent-start": "#4facfe", // Keep blue accent for now
                "neu-accent-end": "#00f2fe",
                surface: "#1a1a1a",
                "surface-highlight": "#2b2b2b",
                text: "#ecf0f1",
                "text-muted": "#94a3b8",
                "matte-black": "#0a0a0a",
            },
            borderRadius: {
                "3xl": "30px",
            },
            boxShadow: {
                "plat-out": "0 20px 40px -10px rgba(0,0,0,1), 0 0 15px rgba(100, 116, 139, 0.2)",
                "plat-in": "inset 2px 2px 5px rgba(0,0,0,0.8), inset -2px -2px 5px rgba(255,255,255,0.05)",
                // Keep these for backward compat unless fully refactoring classes, 
                // but map them to the new style
                "neu-out": "0 20px 40px -10px rgba(0,0,0,1), 0 0 15px rgba(100, 116, 139, 0.2)",
                "neu-in": "inset 2px 2px 5px rgba(0,0,0,0.8), inset -2px -2px 5px rgba(255,255,255,0.05)",
                "neu-flat": "0px 0px 0px #000, 0px 0px 0px #000",
                "soft-glow": "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
            },
            backgroundImage: {
                "plat-gradient": "linear-gradient(135deg, #2b2b2b 0%, #1a1a1a 50%, #000000 100%)",
            },
            fontFamily: {
                sans: ["var(--font-poppins)", "sans-serif"],
                luxurious: ["var(--font-luxurious)", "serif"],
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'flip-reveal': {
                    '0%': { transform: 'rotateY(0deg)' },
                    '100%': { transform: 'rotateY(180deg)' },
                },
                'flip-reset': {
                    '0%': { transform: 'rotateY(180deg)' },
                    '100%': { transform: 'rotateY(0deg)' },
                },
                glitter: {
                    '0%, 100%': { opacity: '0', transform: 'scale(0)' },
                    '50%': { opacity: '1', transform: 'scale(1)' },
                },
                'breathe-glow': {
                    '0%, 100%': { boxShadow: '0 0 10px rgba(79, 172, 254, 0.2)' },
                    '50%': { boxShadow: '0 0 20px rgba(79, 172, 254, 0.5)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                float: 'float 6s ease-in-out infinite',
                'flip-reveal': 'flip-reveal 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards',
                'flip-reset': 'flip-reset 0.8s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards',
                glitter: 'glitter 2s ease-in-out infinite',
                'breathe-glow': 'breathe-glow 4s ease-in-out infinite',
                'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
            }
        },
    },
    plugins: [],
};
export default config;
