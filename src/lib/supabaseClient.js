import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ujviwzfdkhhdjdjkojdk.supabase.co'
const supabaseAnonKey = 'sb_publishable_m6fckO8ZbnP9n2nAM6egRg_prcXiPl5'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)