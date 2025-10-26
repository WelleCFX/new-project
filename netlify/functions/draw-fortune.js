import { createClient } from '@supabase/supabase-js'


export async function handler(event){
try{
const url = process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE
const supabase = createClient(url, key, { auth: { persistSession: false } })


const auth = event.headers.authorization || ''
const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : null
if(!jwt) return { statusCode: 401, body: 'No token' }


const { data: { user }, error } = await supabase.auth.getUser(jwt)
if(error || !user) return { statusCode: 401, body: 'Invalid token' }
const uid = user.id


const today = new Date().toISOString().slice(0,10)
let { data: daily } = await supabase.from('daily_stats').select('*').eq('user_id', uid).eq('day', today).single()
if(!daily){ const { data: ins } = await supabase.from('daily_stats').insert({ user_id: uid, day: today }).select().single(); daily = ins }


const freeLeft = Math.max(0, 3 - daily.free_used)
const extraLeft = Math.max(0, daily.extra_earned - (daily.draws_done - daily.free_used))
if(freeLeft + extraLeft <= 0){ return { statusCode: 400, body: JSON.stringify({ error:'NO_DRAWS_LEFT' }) } }


const { data: taken } = await supabase.from('user_fortunes').select('fortune_id').eq('user_id', uid)
const takenIds = new Set((taken||[]).map(x=>x.fortune_id))
const { data: all } = await supabase.from('fortunes').select('id,text')
const pool = (all||[]).filter(f=>!takenIds.has(f.id))
if(pool.length === 0){ return { statusCode: 400, body: JSON.stringify({ error:'FORTUNES_EXHAUSTED' }) } }


const chosen = pool[Math.floor(Math.random()*pool.length)]
await supabase.from('user_fortunes').insert({ user_id: uid, fortune_id: chosen.id })
await supabase.from('draws').insert({ user_id: uid, fortune_id: chosen.id })


const usedFree = daily.free_used < 3 ? daily.free_used + 1 : daily.free_used
const drawsDone = daily.draws_done + 1
await supabase.from('daily_stats').update({ free_used: usedFree, draws_done: drawsDone }).eq('user_id', uid).eq('day', today)


const { data: prof } = await supabase.from('profiles').select('hearts').eq('id', uid).single()
await supabase.from('profiles').update({ hearts: (prof?.hearts ?? 0) + 2 }).eq('id', uid)


return { statusCode: 200, headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text: chosen.text }) }
}catch(e){ return { statusCode: 500, body: e.message || 'Server error' } }
}