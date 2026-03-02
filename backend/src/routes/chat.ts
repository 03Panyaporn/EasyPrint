import { Hono } from 'hono'
import { supabase } from '../lib/supabase.js'

export const chatRoute = new Hono()

chatRoute.post('/send-message', async (c) => {
    try {
        const { content, sender_type, room_id } = await c.req.json()

        if (!content || !sender_type || !room_id) {
            return c.json({ error: 'Missing required fields: content, sender_type, or room_id' }, 400)
        }

        const { data, error } = await supabase
            .from('messages')
            .insert([{ content, sender_type, room_id }])
            .select()

        if (error) {
            console.error('Error inserting message:', error)
            return c.json({ error: error.message }, 400)
        }

        return c.json(data[0])
    } catch (err: any) {
        console.error('Unexpected error in send-message:', err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
})

chatRoute.get('/history/:room_id', async (c) => {
    const room_id = c.req.param('room_id')

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', room_id)
        .order('created_at', { ascending: true })

    if (error) {
        return c.json({ error: error.message }, 400)
    }

    return c.json(data)
})

// ==========================================
// GET /api/chat/rooms — ดึงรายการห้องแชท (สำหรับ Inbox ร้านค้า)
// ==========================================
chatRoute.get('/rooms', async (c) => {
    // ในระบบจริงควรเช็ค Token เพื่อเอา merchant_id
    // ตอนนี้ขอเขียนแบบดึงทั้งหมดหรือตามระบุไปก่อน
    const { merchant_id } = c.req.query()

    let query = supabase
        .from('chat_rooms')
        .select('*')
        .order('updated_at', { ascending: false })

    if (merchant_id) {
        query = query.eq('merchant_id', merchant_id)
    }

    const { data: rooms, error } = await query

    if (error) {
        console.error('Error fetching chat rooms:', error)
        return c.json({ error: error.message }, 400)
    }

    // สำหรับข้อมูลลูกค้า เราจะพยายามดึง (ถ้าทำได้) หรือปล่อยให้ Frontend จัดการ
    // ในระบบจริงควรมีตาราง profiles ใน public schema
    return c.json(rooms)
})

// ==========================================
// POST /api/chat/get-or-create-room — หาหรือสร้างห้องแชท
// ==========================================
chatRoute.post('/get-or-create-room', async (c) => {
    try {
        const { customer_id, merchant_id } = await c.req.json()

        if (!customer_id || !merchant_id) {
            return c.json({ error: 'Missing customer_id or merchant_id' }, 400)
        }

        // 1. ลองหาห้องเดิมก่อน
        const { data: existingRoom } = await supabase
            .from('chat_rooms')
            .select('*')
            .eq('customer_id', customer_id)
            .eq('merchant_id', merchant_id)
            .maybeSingle()

        if (existingRoom) {
            return c.json(existingRoom)
        }

        // 2. ถ้าไม่เจอ ให้สร้างใหม่
        const { data: newRoom, error: createError } = await supabase
            .from('chat_rooms')
            .insert([{ customer_id, merchant_id }])
            .select()
            .single()

        if (createError) {
            console.error('Create room error:', createError)
            return c.json({
                error: 'สร้างห้องแชทไม่สำเร็จ',
                details: createError.message,
                hint: 'ตรวจสอบว่า ID ของร้านค้า (Merchant ID) ถูกต้องและมีอยู่ในระบบหรือไม่'
            }, 400)
        }

        return c.json(newRoom)
    } catch (err) {
        console.error('Internal Server Error in get-or-create-room:', err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
})

// ==========================================
// GET /api/chat/merchants — ดึงรายการร้านค้า (สำหรับให้ลูกค้าเลือกทัก)
// ==========================================
chatRoute.get('/merchants', async (c) => {
    try {
        // ในระบบ Supabase การค้นหา User ตาม Metadata ต้องใช้ Admin API
        // แต่ถ้าเราไม่มี ให้ดึงจากตาราง shops (ถ้ามี) หรือห้องแชทที่มีอยู่
        // ทางแก้ที่ดีที่สุดคือใช้ตาราง shops มาช่วย
        const { data, error } = await supabase
            .from('shops')
            .select('*')

        if (error) return c.json({ error: error.message }, 400)
        return c.json(data)
    } catch (err) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
})
