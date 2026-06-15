import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { className, label, error, hint, leftIcon, rightIcon, ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "input-base",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-rose-500/50 focus:border-rose-500/70 focus:ring-rose-500/10",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
});
