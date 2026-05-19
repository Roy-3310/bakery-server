import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('缺少 SUPABASE_URL 或 SUPABASE_SERVICE_KEY 環境變數')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
