import React, { useState } from 'react'
import { useStore } from '../state/store'
import StatsBar from '../components/StatsBar'
import ScrollPaper from '../components/ScrollPaper'


export default function FortunePage(){
const { profile, daily, drawFortune, watchAd } = useStore()
const [current, setCurrent] = useState(null)
const [watching, setWatching] = useState(false)
const [msg, setMsg] = useState('')


const freeLeft = Math.max(0, 3 - (daily.free_used||0))
const extraLeft = Math.max(0, (daily.extra_earned||0) - ((daily.draws_done||0) - (daily.free_used||0)))
const canDraw = freeLeft + extraLeft > 0


const onDraw = async ()=>{
setMsg('')
if(!canDraw){ setMsg('Нямаш налични тегления за днес.'); return }
try{ const text = await drawFortune(); setCurrent(text) }catch(e){ setMsg('Грешка: '+(e.message||'')) }
}
const onWatch = ()=>{
if((daily.ads_watched||0) >= 10){ setMsg('Достигнат е дневният лимит за видеа (10).'); return }
setWatching(true); setTimeout(()=>{ watchAd(); setWatching(false) },3000)
}


return (
<section className="grid gap-4">
<StatsBar hearts={profile?.hearts ?? 0} freeUsed={daily.free_used||0} adsWatched={daily.ads_watched||0} />
<div className="p-5 bg-white border rounded-2xl">
<h2 className="text-xl font-semibold">Късметче</h2>
<p className="text-sm text-gray-600 mt-1">Всяко късметче дава +2 сърца. 3 безплатни/ден. До 10 видеа за допълнителни тегления/ден.</p>
{msg && <div className="mt-3 p-3 rounded-xl border bg-red-50 text-sm">{msg}</div>}
<div className="mt-4 flex flex-wrap gap-3">
<button onClick={onDraw} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700">Изтегли късметче</button>
<button onClick={onWatch} disabled={watching} className="px-5 py-2.5 rounded-xl border text-sm disabled:opacity-60">{watching ? 'Гледаш видео…' : 'Гледай видео (още теглене)'}</button>
</div>
{current && <div className="mt-6 flex items-center justify-center"><ScrollPaper text={current} /></div>}
</div>
</section>
)
}