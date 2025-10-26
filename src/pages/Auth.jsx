import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../state/store";


export default function AuthPage() {
const { signIn, signUp } = useStore();
const nav = useNavigate();
const [tab, setTab] = useState("signin"); // signin | signup
const [form, setForm] = useState({ name: "", birthDate: "", email: "", username: "", password: "" });
const [login, setLogin] = useState({ email: "", password: "" });
const [msg, setMsg] = useState("");


const onSignup = (e) => {
e.preventDefault(); setMsg("");
const { name, birthDate, email, username, password } = form;
if (!name || !birthDate || !email || !username || !password) { setMsg("Моля, попълни всички полета."); return; }
try { signUp({ name, birthDate, email, username, password }); nav("/"); } catch (err) {
setMsg(err.message === "email_exists" ? "Този имейл вече е регистриран." : "Грешка. Опитай пак.");
}
};


const onSignin = (e) => {
e.preventDefault(); setMsg("");
try { signIn(login); nav("/"); } catch (err) {
setMsg(err.message === "invalid_credentials" ? "Невалиден имейл или парола." : "Грешка. Опитай пак.");
}
};


function startOAuth(provider) {
alert(`OAuth старт: ${provider} (placeholder)`);
}


return (
<section className="max-w-md mx-auto">
<div className="bg-white border rounded-2xl p-6">
<div className="flex gap-2 mb-4">
<button onClick={() => setTab("signin")} className={`px-3 py-1.5 rounded-lg text-sm border ${tab==='signin'?'bg-indigo-600 text-white border-indigo-600':'hover:bg-gray-50'}`}>Вход</button>
<button onClick={() => setTab("signup")} className={`px-3 py-1.5 rounded-lg text-sm border ${tab==='signup'?'bg-indigo-600 text-white border-indigo-600':'hover:bg-gray-50'}`}>Регистрация</button>
</div>


<div className="grid gap-3">
<button onClick={() => startOAuth("google")} className="h-10 rounded-xl border hover:bg-gray-50">Влез с Google</button>
<button onClick={() => startOAuth("facebook")} className="h-10 rounded-xl border hover:bg-gray-50">Влез с Facebook</button>
<button onClick={() => startOAuth("tiktok")} className="h-10 rounded-xl border hover:bg-gray-50">Влез с TikTok</button>
</div>


<div className="my-5 flex items-center gap-3 text-xs text-gray-500"><div className="flex-1 h-px bg-gray-200" />или<div className="flex-1 h-px bg-gray-200" /></div>


{tab === "signin" ? (
<form className="grid gap-3" onSubmit={onSignin}>
<label className="grid gap-1 text-sm">Имейл<input className="h-10 px-3 rounded-xl border" value={login.email} onChange={(e)=>setLogin({...login, email:e.target.value})} type="email" required/></label>
<label className="grid gap-1 text-sm">Парола<input className="h-10 px-3 rounded-xl border" value={login.password} onChange={(e)=>setLogin({...login, password:e.target.value})} type="password" required minLength={6}/></label>
{msg && <div className="text-sm p-3 rounded-xl border bg-red-50">{msg}</div>}
<button className="h-10 rounded-xl bg-indigo-600 text-white text-sm">Вход</button>
</form>
) : (
<form className="grid gap-3" onSubmit={onSignup}>
<label className="grid gap-1 text-sm">Име<input className="h-10 px-3 rounded-xl border" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required/></label>
<label className="grid gap-1 text-sm">Дата на раждане<input className="h-10 px-3 rounded-xl border" value={form.birthDate} onChange={(e)=>setForm({...form, birthDate:e.target.value})} type="date" required/></label>
<label className="grid gap-1 text-sm">Имейл<input className="h-10 px-3 rounded-xl border" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} type="email" required/></label>
<label className="grid gap-1 text-sm">Потребителско име<input className="h-10 px-3 rounded-xl border" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} required/></label>
<label className="grid gap-1 text-sm">Парола<input className="h-10 px-3 rounded-xl border" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} type="password" required minLength={6}/></label>
{msg && <div className="text-sm p-3 rounded-xl border bg-red-50">{msg}</div>}
<button className="h-10 rounded-xl bg-indigo-600 text-white text-sm">Регистрация</button>
</form>
)}


<p className="mt-4 text-xs text-gray-500">С влизането приемаш Общите условия и Политика за поверителност.</p>
</div>
</section>
);
}