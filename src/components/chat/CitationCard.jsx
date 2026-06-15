import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function CitationCard({ citation, index }) {
  const [open, setOpen] = useState(false);
  const loc = citation.page_number
    ? `Page ${citation.page_number}`
    : citation.row_range
    ? `Rows ${citation.row_range}`
    : citation.section_header
    ? citation.section_header
    : "Source";

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-2 text-left"
      >
        <span className="flex-none w-5 h-5 rounded-md bg-accent-500/15 text-accent-300 text-[10px] font-bold flex items-center justify-center">
          {index + 1}
        </span>
        <FileText size={13} className="flex-none text-zinc-500" />
        <span className="min-w-0 flex-1 truncate text-xs">
          <span className="text-zinc-200 font-medium">{citation.document_name}</span>
          <span className="text-zinc-500"> · {loc}</span>
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-zinc-500 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && citation.content && (
        <div className="px-3 pb-3 pt-1 border-t border-white/[0.05]">
          <p className="text-xs text-zinc-400 leading-relaxed italic line-clamp-6">
            "{citation.content}"
          </p>
        </div>
      )}
    </div>
  );
}
