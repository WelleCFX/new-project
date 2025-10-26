import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const StoreCtx = createContext(null);

export function StoreProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [daily, setDaily] = useState({ free_used: 0, ads_watched: 0, extra_earned: 0, draws_done: 0, day: null });
  const [loading, setLoading] = useState(true);

  // слушаме auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session || null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, s) => {
      setSession(s || null);  // 👈 винаги или null
    });
    return () => subscription.unsubscribe();
  }, []);

  // зареждаме профил + дневни + история
  useEffect(() => {
    async function load() {
      if (!session) { setProfile(null); setHistory([]); setDaily({}); setLoading(false); return; }
      setLoading(true);
      const uid = session.user.id;
      const [pRes, dRes, hRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', uid).single(),
        supabase.from('daily_stats').select('*')
          .eq('user_id', uid).eq('day', new Date().toISOString().slice(0,10)).maybeSingle(),
        supabase.from('draws').select('drawn_at, fortunes(text)')
          .eq('user_id', uid).order('drawn_at', { ascending:false }).limit(50),
      ]);
      setProfile(pRes.data || null);
      setDaily(dRes.data || { day: new Date().toISOString().slice(0,10), free_used:0, ads_watched:0, extra_earned:0, draws_done:0 });
      setHistory((hRes.data || []).map(r => ({ drawn_at: r.drawn_at, text: r.fortunes?.text })));
      setLoading(false);
    }
    load();
  }, [session]);

  const signUp = async ({ name, birthDate, email, username, password }) => {
    const { data: auth, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const uid = auth.user.id;
    await supabase.from('profiles').upsert({ id: uid, name, birth_date: birthDate, email, username }).eq('id', uid);
  };

  const signIn = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => { await supabase.auth.signOut(); };

  const watchAd = async () => {
    const uid = session.user.id;
    const today = new Date().toISOString().slice(0,10);
    const row = daily?.day === today ? daily : { user_id: uid, day: today, free_used:0, ads_watched:0, extra_earned:0, draws_done:0 };
    if (row.ads_watched >= 10) return;
    const next = { ...row, ads_watched: row.ads_watched + 1, extra_earned: row.extra_earned + 1 };
    await supabase.from('daily_stats').upsert({ ...next, user_id: uid, day: today });
    setDaily(next);
  };

  const drawFortune = async () => {
    const token = session?.access_token;
    const res = await fetch('/api/draw-fortune', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'DRAW_ERROR');
    setHistory(h => [{ drawn_at: new Date().toISOString(), text: data.text }, ...h]);
    setProfile(p => ({ ...p, hearts: (p?.hearts ?? 0) + 2 }));
    setDaily(d => ({ ...d, draws_done: (d.draws_done||0) + 1, free_used: Math.min(3, (d.free_used||0) + 1) }));
    return data.text;
  };

  const value = useMemo(() => ({
    session, profile, history, daily, loading,
    signUp, signIn, signOut, watchAd, drawFortune
  }), [session, profile, history, daily, loading]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore in provider');
  return ctx;
}
