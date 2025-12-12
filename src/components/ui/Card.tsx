import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`neumorph-out p-6 rounded-3xl ${className}`}>
            {children}
        </div>
    );
};
