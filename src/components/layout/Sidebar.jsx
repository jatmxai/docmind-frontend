import { useEffect, useState } from "react";
import { Plus, MessageSquare, Trash2, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { cn, relativeTime } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

export function Sidebar({
  activeConversationId,
  onSelect,
  refreshKey,
  onChange,
  onShowDocuments,
}) {
  const [conversations, setConversations] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api
      .get("/conversations")
      .then((r) => setConversations(r.data ?? []))
      .catch(() => setConversations([]));
  }, [refreshKey]);

  const remove = async (id, e) => {
    e.stopPropagation();
    setDeleting(id);
    try {
      await api.delete(`/conversations/${id}`);
      if (activeConversationId === id) onSelect?.(null);
      onChange?.();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <aside className="w-72 flex-none border-r border-white/[0.06] bg-ink-900/40 backdrop-blur-xl flex flex-col">
      <div className="p-4 border-b border-white/[0.06]">
        <button
          onClick={() => onSelect?.(null)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg",
            "bg-gradient-to-br from-accent-500/10 to-accent-700/10",
            "border border-accent-500/20 hover:border-accent-400/40",
            "text-accent-200 hover:text-white text-sm font-medium",
            "shadow-inner-border transition-all"
          )}
        >
          <Plus size={16} />
          New conversation
        </button>
      </div>

      <button
        onClick={onShowDocuments}
        className={cn(
          "mx-3 my-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
          "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
        )}
      >
        <FileText size={14} />
        Documents
      </button>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        <p className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
          Recent
        </p>
        {conversations === null ? (
          <div className="px-2 py-4 flex justify-center">
            <Spinner size={14} />
          </div>
        ) : conversations.length === 0 ? (
          <p className="px-2 py-3 text-xs text-zinc-600">No conversations yet</p>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => onSelect?.(c.id)}
                  className={cn(
                    "group w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all",
                    activeConversationId === c.id
                      ? "bg-accent-500/10 text-accent-100"
                      : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200"
                  )}
                >
                  <MessageSquare size={13} className="flex-none opacity-60" />
                  <span className="flex-1 truncate text-sm">{c.title ?? "Untitled"}</span>
                  <span
                    onClick={(e) => remove(c.id, e)}
                    className={cn(
                      "opacity-0 group-hover:opacity-100 p-1 rounded",
                      "hover:bg-rose-500/20 text-zinc-500 hover:text-rose-300"
                    )}
                  >
                    {deleting === c.id ? <Spinner size={12} /> : <Trash2 size={12} />}
                  </span>
                </button>
                {c.last_message_at && (
                  <p className="pl-9 pt-0.5 pb-1 text-[10px] text-zinc-600">
                    {relativeTime(c.last_message_at)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
