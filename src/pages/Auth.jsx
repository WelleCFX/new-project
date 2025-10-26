import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../state/store";
import { supabase } from '../lib/supabase.js';

export default function AuthPage() {
  const { signIn, signUp } = useStore();
  const nav = useNavigate();
  const [tab, setTab] = useState("signin");
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    email: "",
    username: "",
    password: "",
  });
  const [login, setLogin] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await signUp(form);
      nav("/");
    } catch (err) {
      setMsg(err.message || "Грешка при регистрация");
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await signIn(login);
      nav("/");
    } catch (err) {
      setMsg("Невалиден имейл или парола");
    }
  };

  async function startOAuth(provider) {
  if (provider !== 'google') return; // засега само Google
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin } // връщаме се в приложението
  });
}

  return (
    <section className="max-w-md mx-auto">
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab("signin")} className="px-3 py-1.5 rounded-lg text-sm border">
            Вход
          </button>
          <button onClick={() => setTab("signup")} className="px-3 py-1.5 rounded-lg text-sm border">
            Регистрация
          </button>
        </div>

        {/* Social buttons */}
        <button onClick={() => startOAuth("google")} className="h-10 rounded-xl border hover:bg-gray-50">
          Влез с Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-gray-500">
          <div className="flex-1 h-px bg-gray-200" /> или <div className="flex-1 h-px bg-gray-200" />
        </div>

        {tab === "signin" ? (
          <form className="grid gap-3" onSubmit={handleSignin}>
            <input placeholder="Имейл" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
            <input placeholder="Парола" type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
            {msg && <p className="text-red-500 text-sm">{msg}</p>}
            <button className="h-10 bg-indigo-600 text-white rounded-xl">Вход</button>
          </form>
        ) : (
          <form className="grid gap-3" onSubmit={handleSignup}>
            <input placeholder="Име" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
            <input placeholder="Имейл" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Потребителско име" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input placeholder="Парола" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {msg && <p className="text-red-500 text-sm">{msg}</p>}
            <button className="h-10 bg-indigo-600 text-white rounded-xl">Регистрация</button>
          </form>
        )}
      </div>
    </section>
  );
}
