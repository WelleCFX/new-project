import React, { useState } from "react";


export default function Home() {
const [submitted, setSubmitted] = useState(false);
const [email, setEmail] = useState("");


return (
<section>
<h1 className="text-3xl font-bold">Пусни приложението си в Netlify за минути</h1>
<p className="mt-2 text-gray-600">Лек стартов шаблон с Tailwind, Netlify Forms и Functions.</p>


<div id="features" className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
{["Лек старт", "Netlify Forms", "Functions", "Бърз билд", "SEO", "Разширяем"].map((t, i) => (
<div key={i} className="p-5 border rounded-2xl bg-white">
<div className="h-8 w-8 rounded-lg bg-indigo-600 mb-3" />
<h3 className="font-semibold">{t}</h3>
<p className="text-sm text-gray-600 mt-1">Кратко описание за {t.toLowerCase()}.</p>
</div>
))}
</div>


<div id="contact" className="mt-12 bg-white p-6 rounded-2xl border">
{!submitted ? (
<form
name="contact"
method="POST"
data-netlify="true"
className="grid gap-4"
onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
>
<input type="hidden" name="form-name" value="contact" />
<label className="grid gap-1 text-sm">
Име
<input name="name" className="h-11 px-3 rounded-xl border" placeholder="Иван Иванов" required />
</label>
<label className="grid gap-1 text-sm">
Имейл
<input type="email" name="email" className="h-11 px-3 rounded-xl border" placeholder="name@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
</label>
<label className="grid gap-1 text-sm">
Съобщение
<textarea name="message" className="min-h-[120px] p-3 rounded-xl border" placeholder="Здравей! Искам..." />
</label>
<div className="flex items-center justify-between">
<span className="text-xs text-gray-500">Защитено с Netlify Forms</span>
<button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm" type="submit">Изпрати</button>
</div>
</form>
) : (
<div className="p-4 rounded-xl border bg-green-50">
<p className="text-sm">Благодарим! Ще отговорим на {email || "имейла ти"}.</p>
</div>
)}
</div>
</section>
);
}