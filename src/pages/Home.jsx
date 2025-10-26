import React from "react";
import StatsBar from "../components/StatsBar.jsx";
import { Link } from "react-router-dom";
import { useStore } from "../state/store.jsx";

export default function HomePage() {
  const { profile, daily } = useStore();
  return (
    <section className="grid gap-6">
      <div className="p-5 bg-white border rounded-2xl">
        <h2 className="text-xl font-semibold">Добре дошъл!</h2>
        <p className="text-gray-600 mt-1">Избери секция по-долу:</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/account" className="px-4 py-2 rounded-xl border hover:bg-gray-50">Моят акаунт</Link>
          <Link to="/fortune" className="px-4 py-2 rounded-xl border hover:bg-gray-50">Късметче</Link>
          <Link to="/history" className="px-4 py-2 rounded-xl border hover:bg-gray-50">История</Link>
          <Link to="/achievements" className="px-4 py-2 rounded-xl border hover:bg-gray-50">Постижения</Link>
        </div>
      </div>

      <StatsBar
        hearts={profile?.hearts ?? 0}
        freeUsed={daily?.free_used ?? 0}
        adsWatched={daily?.ads_watched ?? 0}
      />
    </section>
  );
}
