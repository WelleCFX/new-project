import React from "react";
import { useStore } from "../state/store";


export default function HistoryPage() {
const { state } = useStore();
return (
<section className="p-5 bg-white border rounded-2xl">
<h2 className="text-xl font-semibold">История</h2>
<ul className="mt-4 space-y-2 text-sm">
{state.history.map((h, i) => (
<li key={i} className="p-3 rounded-xl border bg-gray-50 flex items-center justify-between">
<span>{h.fortune}</span>
<span className="text-gray-500">{new Date(h.ts).toLocaleString()}</span>
</li>
))}
{state.history.length === 0 && <li className="text-gray-500">Няма тегления още.</li>}
</ul>
</section>
);
}