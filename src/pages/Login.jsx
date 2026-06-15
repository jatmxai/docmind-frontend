import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      nav("/app", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail ?? "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your documents"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="text-accent-300 hover:text-accent-200">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail size={14} />}
          required
          autoFocus
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock size={14} />}
          error={error}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner size={14} className="text-white" /> : <ArrowRight size={14} />}
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-60 pointer-events-none" aria-hidden />
      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="flex items-center gap-2 justify-center mb-8 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl gradient-text">DocMind</span>
        </Link>

        <div className="glass-strong rounded-2xl p-8 gradient-border shadow-glow">
          <h1 className="font-display text-3xl font-bold text-zinc-100 mb-1.5">{title}</h1>
          <p className="text-sm text-zinc-400 mb-6">{subtitle}</p>
          {children}
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">{footer}</p>
      </div>
    </div>
  );
}
