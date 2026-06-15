import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { AuthLayout } from "./Login";

export function Register() {
  const { register } = useAuth();
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
      await register(email, password);
      nav("/app", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail ?? "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free tier: 3 documents, 20 questions"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-accent-300 hover:text-accent-200">
            Sign in
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
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock size={14} />}
          minLength={8}
          error={error}
          hint="Choose a strong password — your documents are private."
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner size={14} className="text-white" /> : <ArrowRight size={14} />}
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
