import { supabase } from './lib/supabase.js'

async function debug() {
    console.log('--- Debugging Message Read Status ---')
    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log(JSON.stringify(messages.map(m => ({
        id: m.id.slice(0, 8),
        room_id: m.room_id,
        sender: m.sender_type,
        content: m.content.slice(0, 20),
        is_read: m.is_read,
        created_at: m.created_at
    })), null, 2))

    const { data: rooms } = await supabase.from('chat_rooms').select('id, unread_count, customer_unread_count')
    console.log('--- Chat Rooms ---')
    console.log(JSON.stringify(rooms, null, 2))
}

debug()
