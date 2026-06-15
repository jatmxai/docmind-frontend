import { LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { QuotaBanner } from "@/components/quota/QuotaBanner";

export function AppShell({ children, quotaRefreshKey }) {
  const { user, logout } = useAuth();
  return (
    <div className="h-screen flex flex-col">
      <header className="flex-none h-14 border-b border-white/[0.06] bg-ink-950/60 backdrop-blur-xl flex items-center px-4 md:px-6 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-glow">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">DocMind</span>
        </div>

        <div className="flex-1" />

        <QuotaBanner refreshKey={quotaRefreshKey} />

        <div className="flex items-center gap-3 pl-3 border-l border-white/[0.06]">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-zinc-500 leading-tight">Signed in as</p>
            <p className="text-sm text-zinc-200 leading-tight truncate max-w-[140px]">
              {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-2 rounded-lg text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex">{children}</main>
    </div>
  );
}
