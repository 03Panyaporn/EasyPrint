import { Hono } from 'hono'
import { setCookie, deleteCookie } from 'hono/cookie'
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

        if (password.length < 8) {
            return c.json({ error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' }, 400)
        }

        if (!/[a-zA-Z]/.test(password)) {
            return c.json({ error: 'รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษอย่างน้อย 1 ตัว' }, 400)
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

        const role = data.user.user_metadata?.role || 'customer'

        // เซ็ต HttpOnly Cookies
        setCookie(c, 'access_token', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            path: '/',
        })
        setCookie(c, 'user_role', role, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            path: '/',
        })

        return c.json({
            message: 'เข้าสู่ระบบสำเร็จ!',
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name,
                role: role,
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
        await supabase.auth.signOut()

        // ลบ HttpOnly Cookies
        deleteCookie(c, 'access_token', { path: '/' })
        deleteCookie(c, 'user_role', { path: '/' })

        return c.json({ message: 'ออกจากระบบสำเร็จ!' })
    } catch (err) {
        console.error('Logout error:', err)
        return c.json({ error: 'เกิดข้อผิดพลาดในระบบ' }, 500)
    }
})

// ==========================================
// POST /api/auth/change-password — เปลี่ยนรหัสผ่าน
// ==========================================
authRoute.post('/change-password', async (c) => {
    try {
        const { email, currentPassword, newPassword } = await c.req.json()

        if (!email || !currentPassword || !newPassword) {
            return c.json({ error: 'กรุณากรอกข้อมูลให้ครบ' }, 400)
        }

        if (newPassword.length < 8) {
            return c.json({ error: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร' }, 400)
        }

        // 1. ลองล็อกอินด้วยรหัสผ่านเดิมก่อนเพื่อตรวจสอบ
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password: currentPassword,
        })

        if (signInError) {
            return c.json({ error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' }, 401)
        }

        // 2. ถ้าถูก ให้อัปเดตรหัสผ่านใหม่
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (updateError) {
            return c.json({ error: updateError.message }, 400)
        }

        return c.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ!' })
    } catch (err) {
        console.error('Change password error:', err)
        return c.json({ error: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' }, 500)
    }
})

// ==========================================
// POST /api/auth/refresh — ต่ออายุโทเค็น
// ==========================================
authRoute.post('/refresh', async (c) => {
    try {
        const { refresh_token } = await c.req.json()

        if (!refresh_token) {
            return c.json({ error: 'Refresh token is required' }, 400)
        }

        const { data, error } = await supabase.auth.refreshSession({
            refresh_token,
        })

        if (error || !data.session) {
            return c.json({ error: 'Invalid or expired refresh token' }, 401)
        }

        // อัปเดต HttpOnly Cookies ด้วย Access Token ใหม่
        setCookie(c, 'access_token', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            path: '/',
        })

        return c.json({
            message: 'Refresh successful',
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at,
            },
        })
    } catch (err) {
        console.error('Refresh error:', err)
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
