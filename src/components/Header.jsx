import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../state/store";


export default function Header() {
const { state, signOut } = useStore();
const authed = !!state.authedUser;


return (
<header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
<div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
<Link to={authed ? "/" : "/auth"} className="flex items-center gap-2">
<div className="h-8 w-8 rounded-xl bg-indigo-600" />
<span className="font-semibold">Късметче</span>
</Link>
{authed ? (
<nav className="hidden sm:flex gap-4 text-sm">
<Link className="hover:text-indigo-600" to="/account">Моят акаунт</Link>
<Link className="hover:text-indigo-600" to="/fortune">Късметче</Link>
<Link className="hover:text-indigo-600" to="/history">История</Link>
<Link className="hover:text-indigo-600" to="/achievements">Постижения</Link>
</nav>
) : (
<span className="text-sm text-gray-500">Гост</span>
)}


{authed ? (
<button onClick={signOut} className="px-3 py-1.5 rounded-lg border text-sm">Изход</button>
) : (
<Link to="/auth" className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm">Вход</Link>
)}
</div>
</header>
);
}