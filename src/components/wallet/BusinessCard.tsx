import React from 'react';

interface BusinessCardProps {
    data: {
        company: string;
        owner: string;
        role: string;
        logo?: string;
    };
    index: number;
    isActive: boolean;
    onClick: () => void;
    style?: React.CSSProperties | any; // Allow Framer Motion styles
}

const BusinessCard: React.FC<BusinessCardProps> = ({ data, index, isActive, onClick, style }) => {
    // Default Stacking Logic (Fallback)
    const translateY = isActive ? 0 : index * 45;
    const translateZ = isActive ? 50 : -index * 30;
    const scale = isActive ? 1.05 : 1 - index * 0.04;

    const defaultTransform = `translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale})`;

    // If external style is provided (from Framer Motion), use it. Otherwise use default.
    // We merge carefully: if style has transform, it wins.
    const finalStyle = style ? { ...style } : { transform: defaultTransform };

    return (
        <div
            onClick={onClick}
            className={`
        absolute left-0 right-0 mx-auto
        w-[340px] h-[215px]
        rounded-xl
        cursor-pointer
        flex flex-col justify-between p-6
        select-none
      `}
            style={{
                ...finalStyle,
                transformStyle: 'preserve-3d',
                transition: style ? 'none' : 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)', // Disable CSS transition if controlled by JS physics
                zIndex: isActive ? 50 : 10 - index, // Ensure visual stacking order

                // Platinum Noir Aesthetic
                background: 'linear-gradient(135deg, #2b2b2b 0%, #1a1a1a 50%, #000000 100%)',
                // Edge lighting (rim light) via border + shadow
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,1), 0 0 15px rgba(100, 116, 139, 0.2)',
            }}
        >
            {/* Content Layer */}
            <div className="flex justify-between items-start">
                {/* Engraved/Foil look for Company */}
                <h3 className="text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 drop-shadow-sm opacity-90">
                    {data.company}
                </h3>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-900 border border-gray-700 shadow-inner flex items-center justify-center">
                    {/* Logo placeholder */}
                    <span className="text-xs text-gray-400 font-bold">{data.company[0]}</span>
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-gray-200 font-medium tracking-wide text-sm" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                    {data.owner}
                </p>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                    {data.role}
                </p>
            </div>

            {/* Subtle metallic sheen overlay */}
            <div
                className="absolute inset-0 rounded-xl pointer-events-none opacity-10"
                style={{
                    background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 25%, transparent 30%)'
                }}
            />
        </div>
    );
};

export default BusinessCard;
