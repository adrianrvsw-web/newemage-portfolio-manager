import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kbwirajxlvvpmqqfwzfh.supabase.co'
const supabaseAnonKey = 'sb_publishable_0_QGOriOX4hCRAPnbZ5-Pw_j66txfw_'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)