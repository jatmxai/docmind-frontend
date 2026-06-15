import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function Spinner({ className, size = 16 }) {
  return (
    <Loader2
      className={cn("animate-spin text-accent-400", className)}
      size={size}
    />
  );
}
