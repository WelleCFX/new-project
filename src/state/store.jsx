import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "luckymvp_state_v1";
const todayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export const FORTUNES = [
  "Щастието е на една крачка.",
  "Очаквай приятна изненада.",
  "Ново запознанство ще ти донесе късмет.",
  "Смелите ги чака успех.",
  "Днес е ден за ново начало.",
  "Усмивката е твоят талисман.",
  "Вярвай си — можеш повече.",
  "Радостта идва в малки дози.",
  "Ще получиш комплимент, който чакаш.",
  "Време е да сбъднеш малка мечта.",
  "Скоро ще чуеш добра новина.",
  "Талантът ти ще бъде забелязан.",
  "Помощ ще дойде неочаквано.",
  "Ще намериш нещо изгубено.",
  "Съдбата обича смелите.",
  "Днес късметът е на твоя страна.",
  "Сърцето ти знае пътя.",
  "Избери радостта.",
  "Времето е твоят съюзник.",
  "Ще получиш подарък на добра воля.",
];

function defaultState() {
  return {
    authedUser: null, // {name, birthDate, email, username}
    hearts: 0,
    daily: {
      date: todayKey(),
      freeDrawsUsed: 0, // от 3
      adsWatched: 0, // от 10
      extraDrawsEarned: 0, // 1 видео = 1 допълнително теглене
      drawsDoneToday: 0,
    },
    history: [], // [{ts, fortune}]
    fortunesDrawn: [], // масив; при нужда го правим на Set
    achievements: {
      opened5: false,
      opened20: false,
      hearts100: false,
    },
    users: [], // демо: [{email, password, name, birthDate, username}]
  };
}

function persist(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function hydrate() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();
  try {
    return JSON.parse(raw);
  } catch {
    return defaultState();
  }
}

function applyAchievements(s) {
  let add = 0;
  const opened = s.history.length;
  const nextAch = { ...s.achievements };
  if (!nextAch.opened5 && opened >= 5) { nextAch.opened5 = true; add += 5; }
  if (!nextAch.opened20 && opened >= 20) { nextAch.opened20 = true; add += 5; }
  if (!nextAch.hearts100 && s.hearts >= 100) { nextAch.hearts100 = true; add += 5; }
  if (add > 0) return { ...s, hearts: s.hearts + add, achievements: nextAch };
  return s;
}

const StoreCtx = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(hydrate);

  // дневен ресет при първо зареждане
  useEffect(() => {
    setState((s) => {
      const today = todayKey();
      if (s.daily.date !== today) {
        const next = {
          ...s,
          daily: { date: today, freeDrawsUsed: 0, adsWatched: 0, extraDrawsEarned: 0, drawsDoneToday: 0 },
        };
        persist(next);
        return next;
      }
      persist(s);
      return s;
    });
  }, []);

  // персист при всяка промяна
  useEffect(() => { persist(state); }, [state]);

  // Actions
  const signUp = (payload) => {
    const { name, birthDate, email, username, password } = payload;
    setState((s) => {
      const exists = s.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) throw new Error("email_exists");
      const newUser = { name, birthDate, email, username, password };
      return { ...s, users: [...s.users, newUser], authedUser: { name, birthDate, email, username } };
    });
  };

  const signIn = ({ email, password }) => {
    setState((s) => {
      const u = s.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!u || u.password !== password) throw new Error("invalid_credentials");
      return { ...s, authedUser: { name: u.name, birthDate: u.birthDate, email: u.email, username: u.username } };
    });
  };

  const signOut = () => setState((s) => ({ ...s, authedUser: null }));

  const watchAd = () => {
    setState((s) => {
      if (s.daily.adsWatched >= 10) return s; // лимит
      return {
        ...s,
        daily: {
          ...s.daily,
          adsWatched: s.daily.adsWatched + 1,
          extraDrawsEarned: s.daily.extraDrawsEarned + 1,
        },
      };
    });
  };

  const drawFortune = () => {
    let chosen = null;
    setState((s) => {
      const freeLeft = Math.max(0, 3 - s.daily.freeDrawsUsed);
      const extraLeft = Math.max(0, s.daily.extraDrawsEarned - (s.daily.drawsDoneToday - s.daily.freeDrawsUsed));
      const canDraw = freeLeft + extraLeft > 0;
      if (!canDraw) return s;

      const drawnSet = new Set(s.fortunesDrawn);
      const pool = FORTUNES.filter((f) => !drawnSet.has(f));
      if (pool.length === 0) return s;

      chosen = pool[Math.floor(Math.random() * pool.length)];
      const usedFree = s.daily.freeDrawsUsed < 3 ? s.daily.freeDrawsUsed + 1 : s.daily.freeDrawsUsed;
      const usedDraws = s.daily.drawsDoneToday + 1;

      let next = {
        ...s,
        hearts: s.hearts + 2,
        daily: { ...s.daily, freeDrawsUsed: usedFree, drawsDoneToday: usedDraws },
        history: [{ ts: Date.now(), fortune: chosen }, ...s.history],
        fortunesDrawn: [...drawnSet, chosen],
      };

      next = applyAchievements(next);
      return next;
    });
    return chosen; // за UI
  };

  const value = useMemo(() => ({ state, signUp, signIn, signOut, watchAd, drawFortune }), [state]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
