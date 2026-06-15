import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { UploadZone } from "@/components/documents/UploadZone";
import { DocumentList } from "@/components/documents/DocumentList";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

export function Dashboard({ onQuotaChange }) {
  const [activeConv, setActiveConv] = useState(null);
  const [convRefresh, setConvRefresh] = useState(0);
  const [docRefresh, setDocRefresh] = useState(0);
  const [showDocs, setShowDocs] = useState(false);

  const bumpQuota = () => onQuotaChange?.();

  return (
    <div className="flex w-full h-full">
      <Sidebar
        activeConversationId={activeConv}
        onSelect={setActiveConv}
        refreshKey={convRefresh}
        onChange={() => setConvRefresh((v) => v + 1)}
        onShowDocuments={() => setShowDocs(true)}
      />

      <div className="flex-1 min-w-0 relative">
        <ChatWindow
          conversationId={activeConv}
          onConversationCreated={(id) => {
            setActiveConv(id);
            setConvRefresh((v) => v + 1);
            bumpQuota();
          }}
          onMessageSent={bumpQuota}
        />
      </div>

      {showDocs && (
        <div className="fixed inset-0 z-40 flex justify-end animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDocs(false)}
          />
          <aside className="relative w-full max-w-md bg-ink-900 border-l border-white/[0.06] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="font-display text-xl font-bold text-zinc-100">Your documents</h2>
              <button
                onClick={() => setShowDocs(false)}
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              <UploadZone
                onUploaded={() => {
                  setDocRefresh((v) => v + 1);
                  bumpQuota();
                }}
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  Library
                </p>
                <DocumentList
                  refreshKey={docRefresh}
                  onChange={() => {
                    setDocRefresh((v) => v + 1);
                    bumpQuota();
                  }}
                />
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
