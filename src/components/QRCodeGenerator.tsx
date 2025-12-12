import React from 'react';

interface QRCodeGeneratorProps {
    value?: string;
    imageUrl?: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ value, imageUrl }) => {
    // If imageUrl is provided (from backend), use it. 
    // Otherwise fallback to generating one or placeholder.

    // Default placeholder or generated
    const defaultQr = value
        ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(value)}`
        : "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example";

    return (
        <div className="w-full aspect-square bg-white p-2 rounded-xl flex items-center justify-center overflow-hidden">
            <img
                src={imageUrl || defaultQr}
                alt="QR Code"
                className="w-full h-full object-contain"
            />
        </div>
    );
};
