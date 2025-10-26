import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";


export default function App() {
return (
<div className="min-h-screen bg-gray-50 text-gray-900">
<Header />
<main className="max-w-6xl mx-auto px-4 py-8">
<Routes>
<Route path="/" element={<Home />} />
<Route path="*" element={<NotFound />} />
</Routes>
</main>
</div>
);
}