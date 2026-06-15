import ReactMarkdown from "react-markdown";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { CitationCard } from "./CitationCard";

export function MessageBubble({ role, content, citations, streaming }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3 animate-fade-in-up", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex-none w-8 h-8 rounded-lg flex items-center justify-center",
          isUser
            ? "bg-white/[0.06] text-zinc-300"
            : "bg-gradient-to-br from-accent-500 to-accent-700 text-white shadow-glow"
        )}
      >
        {isUser ? <User size={14} /> : <Sparkles size={14} />}
      </div>
      <div className={cn("min-w-0 flex-1 max-w-[85%]", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-white/[0.06] text-zinc-100 border border-white/[0.06]"
              : "bg-transparent text-zinc-100"
          )}
        >
          {content ? (
            <div className="prose prose-invert prose-sm max-w-none prose-p:my-1.5 prose-pre:bg-black/40 prose-code:text-accent-300">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            streaming && (
              <span className="inline-block w-2 h-4 bg-accent-400 rounded-sm animate-pulse-glow" />
            )
          )}
          {streaming && content && (
            <span className="inline-block w-2 h-4 ml-0.5 bg-accent-400 rounded-sm animate-pulse-glow translate-y-0.5" />
          )}
        </div>

        {citations && citations.length > 0 && (
          <div className="mt-3 space-y-1.5 w-full">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium pl-1">
              Sources
            </p>
            {citations.map((c, i) => (
              <CitationCard key={i} citation={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
