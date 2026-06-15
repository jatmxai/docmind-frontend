import { useEffect, useState } from "react";
import { Trash2, FileText, FileSpreadsheet, Image as ImageIcon, File } from "lucide-react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { cn, fileTypeFromName, formatBytes, relativeTime } from "@/lib/utils";

const ICON = { pdf: FileText, csv: FileSpreadsheet, docx: File, image: ImageIcon, file: File };

const TONE = {
  pending: "pending",
  processing: "pending",
  indexed: "success",
  failed: "danger",
};

export function DocumentList({ refreshKey, onChange }) {
  const [docs, setDocs] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () =>
    api
      .get("/documents")
      .then((r) => setDocs(r.data ?? []))
      .catch(() => setDocs([]));

  useEffect(() => {
    load();
  }, [refreshKey]);

  useEffect(() => {
    if (!docs) return;
    const hasInflight = docs.some((d) => ["pending", "processing"].includes(d.status));
    if (!hasInflight) return;
    const id = setInterval(load, 2500);
    return () => clearInterval(id);
  }, [docs]);

  const remove = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/documents/${id}`);
      onChange?.();
      load();
    } finally {
      setDeleting(null);
    }
  };

  if (docs === null) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg shimmer-bg" />
        ))}
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="text-center py-10 text-zinc-500 text-sm">
        No documents yet. Drop one above to get started.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {docs.map((d) => {
        const Icon = ICON[fileTypeFromName(d.name)] ?? File;
        const tone = TONE[d.status] ?? "default";
        return (
          <li
            key={d.id}
            className={cn(
              "group flex items-center gap-3 p-3 rounded-lg",
              "bg-white/[0.02] border border-white/[0.05]",
              "hover:bg-white/[0.04] hover:border-white/[0.08] transition-colors"
            )}
          >
            <div className="w-9 h-9 rounded-md bg-accent-500/10 ring-1 ring-accent-500/20 flex items-center justify-center text-accent-300">
              <Icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-100 truncate font-medium">{d.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {d.file_size_bytes && (
                  <span className="text-xs text-zinc-500">
                    {formatBytes(d.file_size_bytes)}
                  </span>
                )}
                {d.created_at && (
                  <span className="text-xs text-zinc-500">· {relativeTime(d.created_at)}</span>
                )}
              </div>
            </div>
            <Badge tone={tone}>
              {d.status === "processing" && <Spinner size={10} className="text-sky-300" />}
              {d.status}
            </Badge>
            <button
              onClick={() => remove(d.id)}
              disabled={deleting === d.id}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-rose-500/10 text-zinc-500 hover:text-rose-300 transition-all"
              title="Delete"
            >
              {deleting === d.id ? <Spinner size={14} /> : <Trash2 size={14} />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
