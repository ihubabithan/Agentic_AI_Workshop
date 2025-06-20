import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(
  ({ 
    className, 
    type = "text", 
    label, 
    icon, 
    rightIcon, 
    error, 
    hint, 
    id, 
    ...props 
  }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}

        <div className="relative group">
          {/* Left Icon */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 group-focus-within:text-blue-500">{icon}</span>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={id}
            type={type}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
            className={cn(
              "block w-full text-base rounded-md transition shadow-sm placeholder:text-gray-400 focus:outline-none",
              "bg-white dark:bg-input/30 border border-input px-3 py-2",
              icon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400/50",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-500 focus-visible:ring-red-400/30",
              className
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">{rightIcon}</span>
            </div>
          )}
        </div>

        {/* Error or Hint */}
        {error ? (
          <p className="text-sm text-red-600 mt-1" id={`${id}-error`}>
            {error}
          </p>
        ) : hint ? (
          <p className="text-sm text-gray-500 mt-1" id={`${id}-hint`}>
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
