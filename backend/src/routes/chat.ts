import { Hono } from 'hono'
import { supabase } from '../lib/supabase.js'

export const chatRoute = new Hono()

// ==========================================
// POST /api/chat/upload — อัปโหลดไฟล์ไปยัง Supabase Storage
// ==========================================
chatRoute.post('/upload', async (c) => {
    try {
        const formData = await c.req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return c.json({ error: 'No file provided' }, 400)
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
        const filePath = `chat/${fileName}`

        const arrayBuffer = await file.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const { error: uploadError } = await supabase.storage
            .from('chat-files')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false,
            })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return c.json({ error: uploadError.message }, 400)
        }

        const { data: publicUrlData } = supabase.storage
            .from('chat-files')
            .getPublicUrl(filePath)

        return c.json({
            url: publicUrlData.publicUrl,
            name: file.name,
            type: file.type,
        })
    } catch (err: any) {
        console.error('Unexpected error in upload:', err)
        return c.json({ error: 'Internal Server Error' }, 500)
    }
})

chatRoute.post('/send-message', async (c) => {
    try {
        const { content, sender_type, room_id, file_url, file_name, file_type } = await c.req.json()

        if (!sender_type || !room_id) {
            return c.json({ error: 'Missing required fields: sender_type, or room_id' }, 400)
        }
        if (!content && !file_url) {
            return c.json({ error: 'Must provide either content or a file' }, 400)
        }

        const insertData: any = { sender_type, room_id, is_read: false }
        if (content) insertData.content = content
        if (file_url) {
            insertData.file_url = file_url
            insertData.file_name = file_name
            insertData.file_type = file_type
        }

        const { data, error } = await supabase
            .from('messages')
            .insert([insertData])
            .select()

        if (error) {
            console.error('Error inserting message:', error)
            return c.json({ error: error.message }, 400)
        }

        // --- Update Chat Room Metadata via Atomic RPC ---
        const isCustomerSender = sender_type === 'customer'
        const lastMessageText = file_url
            ? (file_type?.startsWith('image/') ? '📷 รูปภาพ' : `📎 ${file_name || 'ไฟล์แนบ'}`)
            : content

        const { error: rpcError } = await supabase.rpc('increment_unread_count', {
            room_id: room_id,
            is_customer: !isCustomerSender
        })

        if (rpcError) {
            console.error('Error calling atomic increment RPC:', rpcError)
            await supabase.from('chat_rooms').update({
                last_message: lastMessageText,
                updated_at: new Date().toISOString()
            }).eq('id', room_id)
        } else {
            await supabase.from('chat_rooms').update({ last_message: lastMessageText }).eq('id', room_id)
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
    // ในระบบจริงควรเช็ค Token เพื่อเอา user_id
    // ตอนนี้ขอเขียนแบบดึงทั้งหมดหรือตามระบุไปก่อน
    const { merchant_id, customer_id } = c.req.query()

    let query = supabase
        .from('chat_rooms')
        .select('*')
        .order('updated_at', { ascending: false })

    if (merchant_id) {
        query = query.eq('merchant_id', merchant_id)
    }

    if (customer_id) {
        query = query.eq('customer_id', customer_id)
    }

    const { data: rooms, error } = await query

    if (error) {
        console.error('Error fetching chat rooms:', error)
        return c.json({ error: error.message }, 400)
    }

    // --- Fetch User Info from Supabase Auth ---
    try {
        // Fetch users using Admin API to get metadata (requires Service Role Key)
        const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()

        if (!authError && users) {
            const usersMap = new Map(users.map(u => [u.id, u]))

            const roomsWithUsers = rooms.map(room => {
                const customer = usersMap.get(room.customer_id)
                return {
                    ...room,
                    customer: customer ? {
                        id: customer.id,
                        email: customer.email,
                        raw_user_meta_data: customer.user_metadata
                    } : null
                }
            })
            return c.json(roomsWithUsers)
        }
    } catch (err) {
        console.error('Error fetching user info:', err)
    }

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
// ==========================================
// POST /api/chat/mark-as-read — รีเซ็ตจำนวนข้อความที่ยังไม่ได้อ่าน
// ==========================================
chatRoute.post('/mark-as-read', async (c) => {
    try {
        const { room_id, viewer_type } = await c.req.json()
        if (!room_id) return c.json({ error: 'Missing room_id' }, 400)

        // Determine which count to reset
        const updateData: any = {}
        if (viewer_type === 'merchant') {
            updateData.unread_count = 0
        } else if (viewer_type === 'customer') {
            updateData.customer_unread_count = 0
        } else {
            // Fallback for backward compatibility
            updateData.unread_count = 0
        }

        const { error } = await supabase
            .from('chat_rooms')
            .update(updateData)
            .eq('id', room_id)

        if (error) return c.json({ error: error.message }, 400)
        return c.json({ success: true })
    } catch (err) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
})

// ==========================================
// POST /api/chat/mark-messages-as-read — เปลี่ยนสถานะข้อความฝั่งตรงข้ามเป็นอ่านแล้ว
// ==========================================
chatRoute.post('/mark-messages-as-read', async (c) => {
    try {
        const { room_id, viewer_type } = await c.req.json()
        if (!room_id || !viewer_type) return c.json({ error: 'Missing room_id or viewer_type' }, 400)

        // If merchant is viewing, mark customer's messages as read
        // If customer is viewing, mark merchant's messages as read
        const sender_to_mark = viewer_type === 'merchant' ? 'customer' : 'merchant'

        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('room_id', room_id)
            .eq('sender_type', sender_to_mark)
            .eq('is_read', false)

        if (error) {
            console.error('Error marking messages as read:', error)
            return c.json({ error: error.message }, 400)
        }

        return c.json({ success: true })
    } catch (err) {
        return c.json({ error: 'Internal Server Error' }, 500)
    }
})
