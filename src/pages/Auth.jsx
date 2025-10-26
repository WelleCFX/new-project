import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../state/store.jsx";
import { supabase } from "../lib/supabase.js";

export default function AuthPage() {
  const { signIn, signUp, session } = useStore();
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
  const [loading, setLoading] = useState(false);

  // ако вече сме логнати → махаме от /auth
  useEffect(() => {
    if (session) nav("/", { replace: true });
  }, [session, nav]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await signUp(form);
      nav("/");
    } catch (err) {
      setMsg(err.message || "Грешка при регистрация");
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await signIn(login);
      nav("/");
    } catch (err) {
      setMsg("Невалиден имейл или парола");
    } finally {
      setLoading(false);
    }
  };

  const startGoogle = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      // redirect към Google → после се връщаме
    } catch (err) {
      console.error("Google OAuth error:", err);
      setMsg("Грешка при Google вход.");
    }
  };

  if (session) return null;

  return (
    <section className="max-w-md mx-auto">
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setTab("signin")}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              tab === "signin"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "hover:bg-gray-50"
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              tab === "signup"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "hover:bg-gray-50"
            }`}
          >
            Регистрация
          </button>
        </div>

        <button
          type="button"
          onClick={startGoogle}
          className="h-10 rounded-xl border hover:bg-gray-50"
          disabled={loading}
        >
          Влез с Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-gray-500">
          <div className="flex-1 h-px bg-gray-200" /> или <div className="flex-1 h-px bg-gray-200" />
        </div>

        {tab === "signin" ? (
          <form className="grid gap-3" onSubmit={handleSignin}>
            <input
              className="h-10 px-3 rounded-xl border"
              placeholder="Имейл"
              type="email"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
              required
            />
            <input
              className="h-10 px-3 rounded-xl border"
              placeholder="Парола"
              type="password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              required
            />
            {msg && (
              <p className="text-red-500 text-sm p-2 rounded-xl border bg-red-50">{msg}</p>
            )}
            <button
              className="h-10 bg-indigo-600 text-white rounded-xl disabled:opacity-60"
              disabled={loading}
            >
              Вход
            </button>
          </form>
        ) : (
          <form className="grid gap-3" onSubmit={handleSignup}>
            <input
              className="h-10 px-3 rounded-xl border"
              placeholder="Име"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="h-10 px-3 rounded-xl border"
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              required
            />
            <input
              className="h-10 px-3 rounded-xl border"
              placeholder="Имейл"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              className="h-10 px-3 rounded-xl border"
              placeholder="Потребителско име"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <input
              className="h-10 px-3 rounded-xl border"
              placeholder="Парола"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
            {msg && (
              <p className="text-red-500 text-sm p-2 rounded-xl border bg-red-50">{msg}</p>
            )}
            <button
              className="h-10 bg-indigo-600 text-white rounded-xl disabled:opacity-60"
              disabled={loading}
            >
              Регистрация
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
