import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";

const CustomSelect = ({
  label,
  placeholder = "Select an option",
  options = [],
  value,
  onChange,
  className = "",
  size = "default",
  disabled = false,
  icon = null,
  error = null,
  hint = null,
  id = undefined,
}) => {
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}

        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            id={id}
            className={`
              ${icon ? "pl-10" : ""}
              ${hasError ? "border-red-500 focus:ring-red-400/50" : ""}
              ${className}
            `}
            size={size}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
};

export default CustomSelect;
