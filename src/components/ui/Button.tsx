import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'icon';
    children: React.ReactNode;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    children,
    className = '',
    ...props
}) => {
    const baseStyles = "neumorph-btn px-6 py-3 rounded-3xl font-medium flex items-center justify-center";

    const variants = {
        primary: "neumorph-out text-neu-text-dark active:text-neu-accent-start",
        secondary: "neumorph-flat text-neu-text-light hover:text-neu-text-dark",
        icon: "neumorph-out w-12 h-12 p-0 flex items-center justify-center rounded-full text-neu-text-dark hover:text-neu-accent-start"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
