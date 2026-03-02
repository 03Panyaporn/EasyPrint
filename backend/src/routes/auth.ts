import { Hono } from 'hono'
import { supabase } from '../lib/supabase.js'
import { SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET ?? 'easyprint-secret-key-change-this-in-production'
)

export const authRoute = new Hono()

// ==========================================
// POST /api/auth/register — สมัครสมาชิก
// ==========================================
authRoute.post('/register', async (c) => {
    try {
        const { email, password, name } = await c.req.json()

        // ตรวจสอบข้อมูลที่ส่งมา
        if (!email || !password || !name) {
            return c.json({ error: 'กรุณากรอกข้อมูลให้ครบ (email, password, name)' }, 400)
        }

        if (password.length < 6) {
            return c.json({ error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }, 400)
        }

        // สมัครสมาชิกผ่าน Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name, // เก็บชื่อใน user metadata
                },
            },
        })

        if (error) {
            return c.json({ error: error.message }, 400)
        }

        return c.json({
            message: 'สมัครสมาชิกสำเร็จ!',
            user: {
                id: data.user?.id,
                email: data.user?.email,
                name: data.user?.user_metadata?.name,
            },
        }, 201)
    } catch (err) {
        console.error('Register error:', err)
        return c.json({ error: 'เกิดข้อผิดพลาดในระบบ' }, 500)
    }
})

// ==========================================
// POST /api/auth/login — เข้าสู่ระบบ
// ==========================================
authRoute.post('/login', async (c) => {
    try {
        const { email, password } = await c.req.json()

        if (!email || !password) {
            return c.json({ error: 'กรุณากรอก email และ password' }, 400)
        }

        // Login ผ่าน Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return c.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, 401)
        }

        return c.json({
            message: 'เข้าสู่ระบบสำเร็จ!',
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name,
                role: data.user.user_metadata?.role || 'customer', // Default เป็น customer
            },
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at,
            },
        })
    } catch (err) {
        console.error('Login error:', err)
        return c.json({ error: 'เกิดข้อผิดพลาดในระบบ' }, 500)
    }
})

// (Removed shop-login as it is now combined into the main login)

// ==========================================
// POST /api/auth/logout — ออกจากระบบ
// ==========================================
authRoute.post('/logout', async (c) => {
    try {
        const { error } = await supabase.auth.signOut()

        if (error) {
            return c.json({ error: error.message }, 400)
        }

        return c.json({ message: 'ออกจากระบบสำเร็จ!' })
    } catch (err) {
        console.error('Logout error:', err)
        return c.json({ error: 'เกิดข้อผิดพลาดในระบบ' }, 500)
    }
})

// ==========================================
// GET /api/auth/me — ดูข้อมูลผู้ใช้ปัจจุบัน
// ==========================================
authRoute.get('/me', async (c) => {
    try {
        const authHeader = c.req.header('Authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ error: 'กรุณาล็อกอินก่อน' }, 401)
        }

        const token = authHeader.split(' ')[1]

        // ตรวจสอบ token กับ Supabase
        const { data, error } = await supabase.auth.getUser(token)

        if (error || !data.user) {
            return c.json({ error: 'Token ไม่ถูกต้องหรือหมดอายุ' }, 401)
        }

        return c.json({
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name,
                created_at: data.user.created_at,
            },
        })
    } catch (err) {
        console.error('Get user error:', err)
        return c.json({ error: 'เกิดข้อผิดพลาดในระบบ' }, 500)
    }
})
