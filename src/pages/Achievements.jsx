import React from "react";
import StatsBar from "../components/StatsBar.jsx";
import { useStore } from "../state/store.jsx";

export default function AchievementsPage() {
  const { profile, history, daily } = useStore();
  const opened = history.length;
  const hearts = profile?.hearts ?? 0;

  const items = [
    { id: "opened5",  label: "Отворени 5 късметчета",  earned: opened >= 5 },
    { id: "opened20", label: "Отворени 20 късметчета", earned: opened >= 20 },
    { id: "hearts100", label: "Събрани 100 сърца",      earned: hearts >= 100 },
  ];

  return (
    <section className="grid gap-4">
      <div className="p-5 bg-white border rounded-2xl">
        <h2 className="text-xl font-semibold">Постижения</h2>
        <ul className="mt-4 grid gap-2">
          {items.map(a => (
            <li key={a.id} className="p-3 rounded-xl border bg-gray-50 flex items-center justify-between">
              <span>{a.label}</span>
              <span className={`text-sm ${a.earned ? "text-green-600" : "text-gray-500"}`}>
                {a.earned ? "Получено ✅" : "Още не"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <StatsBar
        hearts={hearts}
        freeUsed={daily?.free_used ?? 0}
        adsWatched={daily?.ads_watched ?? 0}
      />
      <div className="text-xs text-gray-500">Общо отворени: {opened}</div>
    </section>
  );
}
