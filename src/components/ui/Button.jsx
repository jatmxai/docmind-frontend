import { cn } from "@/lib/utils";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  const base = "btn-primary";
  const variants = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    danger:
      "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm " +
      "bg-rose-500/10 text-rose-300 hover:bg-rose-500/15 border border-rose-500/20 hover:border-rose-500/40 " +
      "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-rose-400/40 " +
      "disabled:opacity-50 disabled:pointer-events-none",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(variants[variant] || base, sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
