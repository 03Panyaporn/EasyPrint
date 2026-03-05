import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

config({ path: '.env' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
    console.log('Verifying columns...')

    const { data: mData, error: mError } = await supabase
        .from('messages')
        .select('is_read')
        .limit(1)

    if (mError) {
        console.error('❌ Column is_read in messages table NOT FOUND:', mError.message)
    } else {
        console.log('✅ Column is_read in messages table exists.')
    }

    const { data: rData, error: rError } = await supabase
        .from('chat_rooms')
        .select('unread_count')
        .limit(1)

    if (rError) {
        console.error('❌ Column unread_count in chat_rooms table NOT FOUND:', rError.message)
    } else {
        console.log('✅ Column unread_count in chat_rooms table exists.')
    }
}

verify()
