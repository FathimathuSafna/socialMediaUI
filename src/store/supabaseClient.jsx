import { createClient } from '@supabase/supabase-js'


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl) {
    throw new Error('Missing VITE_SUPABASE_URL')
  }
  if (!supabaseKey) {
    throw new Error('Missing VITE_SUPABASE_KEY')
  }



export const supabase = createClient(supabaseUrl, supabaseKey)

