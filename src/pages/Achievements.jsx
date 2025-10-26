import React from "react";
import StatsBar from "../components/StatsBar";
import { useStore } from "../state/store";


export default function AchievementsPage() {
const { state } = useStore();
const opened = state.history.length;
const items = [
{ id: "opened5", label: "Отворени 5 късметчета", earned: state.achievements.opened5 },
{ id: "opened20", label: "Отворени 20 късметчета", earned: state.achievements.opened20 },
{ id: "hearts100", label: "Събрани 100 сърца", earned: state.achievements.hearts100 },
];


return (
<section className="grid gap-4">
<div className="p-5 bg-white border rounded-2xl">
<h2 className="text-xl font-semibold">Постижения</h2>
<p className="text-sm text-gray-600 mt-1">Всяко постижение носи +5 сърца еднократно.</p>
<ul className="mt-4 grid gap-2">
{items.map((a) => (
<li key={a.id} className="p-3 rounded-xl border bg-gray-50 flex items-center justify-between">
<span>{a.label}</span>
<span className={`text-sm ${a.earned ? 'text-green-600' : 'text-gray-500'}`}>{a.earned ? 'Получено ✅' : 'Още не'}</span>
</li>
))}
</ul>
</div>


<StatsBar hearts={state.hearts} freeUsed={state.daily.freeDrawsUsed} adsWatched={state.daily.adsWatched} />


<div className="text-xs text-gray-500">Общо отворени: {opened}</div>
</section>
);
}