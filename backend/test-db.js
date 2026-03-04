import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
    console.log('Testing connection to:', supabaseUrl)
    const { data: messages, error: mError } = await supabase.from('messages').select('*').limit(1)
    if (mError) {
        console.error('Error fetching messages:', mError)
    } else {
        console.log('Messages table check:', messages)
    }

    const { data: rooms, error: rError } = await supabase.from('chat_rooms').select('*').limit(1)
    if (rError) {
        console.error('Error fetching chat_rooms:', rError)
    } else {
        console.log('Chat rooms table check:', rooms)
    }
}

test()
