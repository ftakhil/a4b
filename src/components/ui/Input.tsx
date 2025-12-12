import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && <label className="ml-4 font-luxurious text-sm uppercase tracking-widest text-gray-400/80 mb-1">{label}</label>}
            <input
                className={`neumorph-in px-6 py-4 outline-none focus:ring-2 focus:ring-neu-accent-start/20 transition-all ${className}`}
                {...props}
            />
        </div>
    );
};
