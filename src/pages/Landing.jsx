import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  FileText,
  MessageSquare,
  Quote,
  Lock,
  Zap,
  Github,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

export function Landing() {
  const { loginAsDemo } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const [loadingDemo, setLoadingDemo] = useState(false);

  const tryDemo = async () => {
    setLoadingDemo(true);
    try {
      await loginAsDemo();
      toast.success(
        "Welcome to the demo",
        "A sample document is being indexed for you — it'll appear in the library shortly."
      );
      nav("/app", { replace: true });
    } catch (err) {
      toast.error(
        "Couldn't start the demo",
        err.response?.data?.detail ?? "Try again in a moment."
      );
      setLoadingDemo(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="px-6 md:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-glow">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">DocMind</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/jatmxai-lab/docmind"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <Github size={14} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <Link to="/login" className="btn-ghost">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary">
            Get started
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex-1 flex items-center px-6 md:px-10 py-20">
        <div
          className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] mask-radial opacity-50 pointer-events-none"
          aria-hidden
        />
        <div className="relative max-w-5xl mx-auto text-center w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-400 mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Powered by Gemini · Pinecone · FastAPI
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-balance leading-[1.05] tracking-tight animate-fade-in-up">
            Talk to your <span className="gradient-text">documents</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto text-balance animate-fade-in-up">
            Upload PDFs, spreadsheets, Word docs, or images. Ask anything. Get
            streaming answers with citations to the exact page, row, or section.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 animate-fade-in-up">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={tryDemo}
                disabled={loadingDemo}
                className="btn-primary"
              >
                {loadingDemo ? <Spinner size={14} className="text-white" /> : <Play size={14} />}
                Try the demo — no signup
              </button>
              <Link to="/register" className="btn-ghost">
                Create an account
                <ArrowRight size={14} />
              </Link>
            </div>
            <p className="text-xs text-zinc-500">
              Demo accounts are ephemeral and come with a sample document already indexed.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <Feature
              icon={<FileText className="text-accent-300" size={18} />}
              title="Multi-format ingestion"
              body="PDF, CSV, DOCX, and images via Gemini's native vision. One pipeline, four file types, consistent citations."
            />
            <Feature
              icon={<MessageSquare className="text-accent-300" size={18} />}
              title="Streaming answers"
              body="Tokens flow in as they're generated. No waiting on a wall of text. Server-Sent Events end-to-end."
            />
            <Feature
              icon={<Quote className="text-accent-300" size={18} />}
              title="Inline citations"
              body="Every answer carries source markers. Click to expand the exact excerpt — page number, row range, or section."
            />
            <Feature
              icon={<Zap className="text-accent-300" size={18} />}
              title="Hybrid LLM pool"
              body="Multi-key Gemini rotation with cooldown-on-429. No rate-limit blocks during the demo, ever."
            />
            <Feature
              icon={<Lock className="text-accent-300" size={18} />}
              title="JWT + free tier"
              body="Per-user quotas enforced in Redis. 20 questions, 3 documents, 10 MB each — controlled by design."
            />
            <Feature
              icon={<Sparkles className="text-accent-300" size={18} />}
              title="Open source"
              body="Full source on GitHub. FastAPI + React + Pinecone + Supabase. Deploy your own in 30 minutes."
            />
          </div>
        </div>
      </section>

      <footer className="px-6 md:px-10 py-6 border-t border-white/[0.04] text-center text-sm text-zinc-500">
        Built with FastAPI, React, Pinecone, and Google Gemini.
      </footer>
    </div>
  );
}

function Feature({ icon, title, body }) {
  return (
    <div className="glass rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
      <div className="w-9 h-9 rounded-lg bg-accent-500/10 ring-1 ring-accent-500/20 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-semibold text-zinc-100 mb-1.5">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
    </div>
  );
}
