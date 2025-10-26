import { createClient } from '@supabase/supabase-js'

console.log('ENV check →', {
  url: import.meta.env.VITE_SUPABASE_URL,
  hasAnon: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
})

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: true } }
)
