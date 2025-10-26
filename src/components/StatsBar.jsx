import React from "react";


export default function StatsBar({ hearts, freeUsed, adsWatched }) {
const freeLeft = Math.max(0, 3 - freeUsed);
return (
<div className="p-4 rounded-2xl border bg-white grid sm:grid-cols-3 gap-3 text-sm">
<div><span className="text-gray-500">Сърца:</span> <b>{hearts}</b></div>
<div><span className="text-gray-500">Безплатни за днес:</span> <b>{freeLeft}</b> / 3</div>
<div><span className="text-gray-500">Гледани видеа:</span> <b>{adsWatched}</b> / 10</div>
</div>
);
}