import React from "react";
import { useStore } from "../state/store";


export default function AccountPage() {
const { state } = useStore();
const u = state.authedUser;
return (
<section className="grid gap-4">
<div className="p-5 bg-white border rounded-2xl">
<h2 className="text-xl font-semibold">Моят акаунт</h2>
<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
<Info label="Име" value={u?.name} />
<Info label="Дата на раждане" value={u?.birthDate} />
<Info label="Имейл" value={u?.email} />
<Info label="Потребителско име" value={u?.username} />
<Info label="Сърца" value={state.hearts} />
</div>
</div>
</section>
);
}


function Info({ label, value }) {
return (
<div className="p-3 rounded-xl border bg-gray-50 flex items-center justify-between">
<span className="text-gray-600">{label}</span>
<b>{String(value ?? "-")}</b>
</div>
);
}