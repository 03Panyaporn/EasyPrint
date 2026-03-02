import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
// ใช้ Service Role Key ถ้ามี เพื่อบายพาส RLS สำหรับ Backend
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or keys in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

console.log('✅ Supabase client initialized')
console.log('🔑 Key Prefix:', supabaseKey.substring(0, 10) + '...')
console.log('🔑 Using key type:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON')
