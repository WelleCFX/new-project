import React from "react";
import { Link } from "react-router-dom";


export default function Header() {
return (
<header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
<div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
<Link to="/" className="flex items-center gap-2">
<div className="h-8 w-8 rounded-xl bg-indigo-600" />
<span className="font-semibold">My Netlify React</span>
</Link>
<nav className="hidden sm:flex gap-6 text-sm">
<a href="#features" className="hover:text-indigo-600">Функции</a>
<a href="#contact" className="hover:text-indigo-600">Контакт</a>
</nav>
<a href="#contact" className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm">Започни</a>
</div>
</header>
);
}