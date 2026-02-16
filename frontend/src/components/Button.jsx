import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

const Button = ({ children, isLoading, variant = 'primary', className, ...props }) => {
    const baseStyles = "px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
        danger: "bg-red-500 text-white hover:bg-red-600",
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], className))}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
