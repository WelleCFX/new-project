import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { StoreProvider, useStore } from "./state/store.jsx";
import Header from "./components/Header.jsx";
import AuthPage from "./pages/Auth.jsx";
import HomePage from "./pages/Home.jsx";
import AccountPage from "./pages/Account.jsx";
import FortunePage from "./pages/Fortune.jsx";
import HistoryPage from "./pages/History.jsx";
import AchievementsPage from "./pages/Achievements.jsx";

function Protected({ children }) {
  const { session } = useStore();
  const loc = useLocation();
  if (!session) return <Navigate to="/auth" state={{ from: loc }} replace />;
  return children;
}

// ➜ ако има сесия, /auth да редиректва към /
function AuthGate({ children }) {
  const { session } = useStore();
  return session ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/auth" element={<AuthGate><AuthPage /></AuthGate>} />
            <Route path="/" element={<Protected><HomePage /></Protected>} />
            <Route path="/account" element={<Protected><AccountPage /></Protected>} />
            <Route path="/fortune" element={<Protected><FortunePage /></Protected>} />
            <Route path="/history" element={<Protected><HistoryPage /></Protected>} />
            <Route path="/achievements" element={<Protected><AchievementsPage /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </StoreProvider>
  );
}
