import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import { AppShell } from "@/components/layout/AppShell";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Dashboard } from "@/pages/Dashboard";
import { Spinner } from "@/components/ui/Spinner";

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
          <Route path="/app" element={<Private><AppRoot /></Private>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}

function AppRoot() {
  const [quotaKey, setQuotaKey] = useState(0);
  return (
    <AppShell quotaRefreshKey={quotaKey}>
      <Dashboard onQuotaChange={() => setQuotaKey((v) => v + 1)} />
    </AppShell>
  );
}

function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenSpinner />;
  if (user) return <Navigate to="/app" replace />;
  return children;
}

function FullScreenSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size={24} />
    </div>
  );
}
