import React, { useState } from "react";
import { useStore } from "../state/store";
import StatsBar from "../components/StatsBar";
import ScrollPaper from "../components/ScrollPaper";


export default function FortunePage() {
const { state, drawFortune, watchAd } = useStore();
const [current, setCurrent] = useState(null);
const [watching, setWatching] = useState(false);
const [msg, setMsg] = useState("");


const freeLeft = Math.max(0, 3 - state.daily.freeDrawsUsed);
const extraLeft = Math.max(0, state.daily.extraDrawsEarned - (state.daily.drawsDoneToday - state.daily.freeDrawsUsed));
const canDraw = freeLeft + extraLeft > 0;


const onDraw = () => {
setMsg("");
if (!canDraw) { setMsg("Нямаш налични тегления за днес. Гледай видео за още опит."); return; }
const f = drawFortune();
if (!f) { setMsg("Изчерпани са всички късметчета."); return; }
setCurrent(f);
};


const onWatch = () => {
if (state.daily.adsWatched >= 10) { setMsg("Достигнат е дневният лимит за видеа (10)."); return; }
setWatching(true);
setTimeout(() => { watchAd(); setWatching(false); }, 3000);
};


return (
<section className="grid gap-4">
<StatsBar hearts={state.hearts} freeUsed={state.daily.freeDrawsUsed} adsWatched={state.daily.adsWatched} />


<div className="p-5 bg-white border rounded-2xl">
<h2 className="text-xl font-semibold">Късметче</h2>
<p className="text-sm text-gray-600 mt-1">Всяко късметче дава +2 сърца. 3 безплатни/ден. До 10 видеа за допълнителни тегления/ден.</p>


{msg && <div className="mt-3 p-3 rounded-xl border bg-red-50 text-sm">{msg}</div>}


<div className="mt-4 flex flex-wrap gap-3">
<button onClick={onDraw} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700">Изтегли късметче</button>
<button onClick={onWatch} disabled={watching} className="px-5 py-2.5 rounded-xl border text-sm disabled:opacity-60">{watching ? "Гледаш видео…" : "Гледай видео (още теглене)"}</button>
</div>


{current && (
<div className="mt-6 flex items-center justify-center">
<ScrollPaper text={current} />
</div>
)}
</div>


<div className="p-5 bg-white border rounded-2xl">
<h3 className="font-semibold">История (последни 20)</h3>
<ul className="mt-3 space-y-2 text-sm">
{state.history.slice(0, 20).map((h, i) => (
<li key={i} className="p-3 rounded-xl border bg-gray-50 flex items-center justify-between">
<span>{h.fortune}</span>
<span className="text-gray-500">{new Date(h.ts).toLocaleString()}</span>
</li>
))}
{state.history.length === 0 && <li className="text-gray-500">Няма тегления още.</li>}
</ul>
</div>
</section>
);
}