import { cn } from "@/lib/utils";

const tones = {
  default: "bg-white/[0.05] text-zinc-300 border-white/[0.06]",
  accent: "bg-accent-500/15 text-accent-300 border-accent-500/30",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  danger: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  pending: "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

export function Badge({ tone = "default", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
