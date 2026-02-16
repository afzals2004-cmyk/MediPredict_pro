import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({ label, error, className, ...props }, ref) => {
    return (
        <div className="w-full group">
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-blue-400">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={twMerge(
                    clsx(
                        "input-field",
                        error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "",
                        className
                    )
                )}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-400 font-medium">{error.message}</p>}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
