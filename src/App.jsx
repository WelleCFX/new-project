import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { StoreProvider, useStore } from "./state/store";
import Header from "./components/Header";
import AuthPage from "./pages/Auth";
import HomePage from "./pages/Home";
import AccountPage from "./pages/Account";
import FortunePage from "./pages/Fortune";
import HistoryPage from "./pages/History";
import AchievementsPage from "./pages/Achievements";


function Protected({ children }) {
const { state } = useStore();
const loc = useLocation();
if (!state.authedUser) return <Navigate to="/auth" state={{ from: loc }} replace />;
return children;
}


export default function App() {
return (
<StoreProvider>
<div className="min-h-screen bg-gray-50 text-gray-900">
<Header />
<main className="max-w-3xl mx-auto px-4 py-8">
<Routes>
<Route path="/auth" element={<AuthPage />} />
<Route path="/" element={<Protected><HomePage /></Protected>} />
<Route path="/account" element={<Protected><AccountPage /></Protected>} />
<Route path="/fortune" element={<Protected><FortunePage /></Protected>} />
<Route path="/history" element={<Protected><HistoryPage /></Protected>} />
<Route path="/achievements" element={<Protected><AchievementsPage /></Protected>} />
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
</main>
<footer className="mt-10 py-10 border-t">
<div className="max-w-3xl mx-auto px-4 text-sm text-gray-600 flex items-center justify-between">
<p>© {new Date().getFullYear()} Късметче</p>
<div className="flex gap-3"><span>v1</span></div>
</div>
</footer>
</div>
</StoreProvider>
);
}