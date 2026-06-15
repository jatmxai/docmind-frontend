import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, MessageSquarePlus } from "lucide-react";
import { api, SSE_URL, tokens } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { MessageBubble } from "./MessageBubble";
import { cn } from "@/lib/utils";

export function ChatWindow({ conversationId, onConversationCreated, onMessageSent }) {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [streamedCitations, setStreamedCitations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedText]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    setLoadingHistory(true);
    api
      .get(`/conversations/${conversationId}/messages`)
      .then((r) => setMessages(r.data ?? []))
      .catch(() => setMessages([]))
      .finally(() => setLoadingHistory(false));
  }, [conversationId]);

  const pickPrompt = (prompt) => {
    setInput(prompt);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const send = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    let cid = conversationId;
    if (!cid) {
      try {
        const r = await api.post("/conversations", { title: text.slice(0, 80) });
        cid = r.data.id;
        onConversationCreated?.(cid);
      } catch (err) {
        const detail = err.response?.data?.detail;
        toast.error(
          "Couldn't start a new chat",
          detail?.message ?? detail ?? "Try again in a moment."
        );
        return;
      }
    }

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setStreaming(true);
    setStreamedText("");
    setStreamedCitations([]);

    try {
      const res = await fetch(SSE_URL(`/conversations/${cid}/messages`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok || !res.body) {
        const errData = await res.json().catch(() => ({}));
        const msg =
          errData?.detail?.message ??
          errData?.detail ??
          `Request failed (${res.status})`;
        throw new Error(typeof msg === "string" ? msg : "Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let fullText = "";
      let citations = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop() ?? "";
        for (const ev of events) {
          const lines = ev.split("\n");
          let event = "message";
          let dataStr = "";
          for (const l of lines) {
            if (l.startsWith("event:")) event = l.slice(6).trim();
            else if (l.startsWith("data:")) dataStr += l.slice(5).trim();
          }
          if (!dataStr) continue;
          try {
            const data = JSON.parse(dataStr);
            if (event === "citations") {
              citations = data;
              setStreamedCitations(citations);
            } else if (event === "error") {
              throw new Error(data.message ?? "Stream error");
            } else if (event === "done") {
              // handled below
            } else if (data.token !== undefined) {
              fullText += data.token;
              setStreamedText(fullText);
            }
          } catch (e) {
            if (e instanceof Error && e.message.startsWith("Stream")) throw e;
          }
        }
      }
      setMessages((m) => [
        ...m,
        { role: "assistant", content: fullText, citations },
      ]);
      onMessageSent?.();
    } catch (err) {
      toast.error("Couldn't send message", err.message ?? "Try again.");
      // Roll back the optimistic user message so the next attempt is clean
      setMessages((m) => m.slice(0, -1));
      setInput(text);
    } finally {
      setStreaming(false);
      setStreamedText("");
      setStreamedCitations([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {loadingHistory ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : messages.length === 0 && !streaming ? (
          <EmptyState onPick={pickPrompt} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((m, i) => (
              <MessageBubble
                key={i}
                role={m.role}
                content={m.content}
                citations={m.citations}
              />
            ))}
            {streaming && (
              <MessageBubble
                role="assistant"
                content={streamedText}
                citations={streamedCitations}
                streaming
              />
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      <div className="border-t border-white/[0.06] bg-ink-950/60 backdrop-blur-xl px-4 md:px-8 py-4">
        <form onSubmit={send} className="max-w-3xl mx-auto flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask anything about your documents…"
              rows={1}
              className={cn(
                "w-full px-4 py-3 pr-12 rounded-xl resize-none",
                "bg-white/[0.04] border border-white/[0.08]",
                "text-zinc-100 placeholder:text-zinc-500",
                "focus:outline-none focus:border-accent-500/60 focus:bg-white/[0.06]",
                "focus:ring-4 focus:ring-accent-500/10",
                "transition-all duration-150 max-h-32"
              )}
            />
            <span className="absolute right-3 bottom-3 text-[10px] text-zinc-600 font-mono">
              ⏎
            </span>
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || streaming}
            className="h-[46px] aspect-square px-0"
          >
            {streaming ? <Spinner size={16} className="text-white" /> : <Send size={16} />}
          </Button>
        </form>
      </div>
    </div>
  );
}

function EmptyState({ onPick }) {
  const examples = [
    "Summarize the key risks in this contract",
    "What was R&D spend last year?",
    "Compare growth across regions in the data",
    "Extract all dates and deadlines",
  ];
  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col items-center justify-center text-center pt-20">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500/30 to-accent-700/30 ring-1 ring-accent-500/40 flex items-center justify-center mb-4 shadow-glow">
        <Sparkles size={28} className="text-accent-200" />
      </div>
      <h2 className="text-2xl font-display font-bold text-zinc-100 mb-2 text-balance">
        Ask anything about your documents
      </h2>
      <p className="text-zinc-500 text-sm mb-8 max-w-md">
        Cited answers. Page-level references. Multi-format support for PDFs, CSVs, Word docs, and images.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
        {examples.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => onPick?.(ex)}
            className={cn(
              "group px-3 py-2.5 text-sm text-left rounded-lg",
              "border border-white/[0.06] bg-white/[0.02]",
              "hover:bg-white/[0.06] hover:border-accent-500/30",
              "focus:outline-none focus:ring-2 focus:ring-accent-500/40",
              "transition-all duration-150"
            )}
          >
            <span className="inline-flex items-center gap-2 text-zinc-400 group-hover:text-zinc-100 transition-colors">
              <MessageSquarePlus size={13} className="text-accent-400 group-hover:scale-110 transition-transform" />
              {ex}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
