import React from 'react';

interface QRCodeGeneratorProps {
    value?: string;
    imageUrl?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ value, imageUrl }) => {
    // If we have an image URL (from backend), use it.
    if (imageUrl) {
        return (
            <div className="w-full aspect-square bg-white p-2 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                    src={imageUrl}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                />
            </div>
        );
    }

    // If we have a value to generate on the fly
    if (value) {
        const generatedUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(value)}`;
        return (
            <div className="w-full aspect-square bg-white p-2 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                    src={generatedUrl}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                />
            </div>
        );
    }

    // Otherwise, show a loading placeholder or empty state
    // User requested: "do not load up with semi data... remove example qr generator"
    // "Have a simple loading animation"
    return (
        <div className="w-full aspect-square bg-white/5 rounded-xl flex items-center justify-center animate-pulse border border-white/10">
            <div className="w-8 h-8 border-2 border-neu-accent-start border-t-transparent rounded-full animate-spin" />
        </div>
    );
};
