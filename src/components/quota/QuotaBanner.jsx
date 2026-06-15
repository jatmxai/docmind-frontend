import { useEffect, useState } from "react";
import { Zap, FileText, MessageCircle } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const LABELS = {
  questions_total: { icon: MessageCircle, label: "questions" },
  documents_total: { icon: FileText, label: "documents" },
  conversations_total: { icon: Zap, label: "chats" },
};

export function QuotaBanner({ refreshKey }) {
  const [quota, setQuota] = useState(null);

  useEffect(() => {
    api.get("/users/me/quota").then((r) => setQuota(r.data)).catch(() => {});
  }, [refreshKey]);

  if (!quota) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass">
        <div className="h-3.5 w-24 rounded shimmer-bg" />
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg glass">
      {Object.entries(LABELS).map(([key, { icon: Icon, label }]) => {
        const item = quota[key];
        if (!item) return null;
        const pct = (item.used / item.limit) * 100;
        const warn = pct >= 80;
        return (
          <div
            key={key}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors",
              warn ? "text-amber-300" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Icon size={13} />
            <span className="text-xs font-medium tabular-nums">
              {item.used}/{item.limit}
            </span>
            <span className="text-xs text-zinc-500 hidden lg:inline">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
