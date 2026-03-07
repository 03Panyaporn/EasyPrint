import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { exampleRoute } from './routes/example.js'
import { authRoute } from './routes/auth.js'
import { chatRoute } from './routes/chat.js'

const app = new Hono()

// --- 1. Middleware ---
app.use('*', logger())

// ปรับ CORS ให้ดึงค่าจาก Environment Variable
app.use(
    '*',
    cors({
        // ในช่วงพัฒนาให้ใช้ origin ตามที่ส่งมา แต่ถ้า Production ให้ใช้จาก FRONTEND_URL
        origin: (origin) => {
            if (process.env.NODE_ENV === 'production') {
                return process.env.FRONTEND_URL || origin
            }
            return origin
        },
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        credentials: true,
    })
)

// --- 2. Routes ---
app.get('/', (c) => {
    return c.json({ message: 'EasyPrint Backend API', status: 'running' })
})

app.get('/api/health', (c) => {
    return c.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    })
})

app.route('/api/example', exampleRoute)
app.route('/api/auth', authRoute)
app.route('/api/chat', chatRoute)

// --- 3. Start server (Conditional) ---
// ส่วนนี้จะทำงานเฉพาะตอนรันในเครื่อง (npm run dev) 
// แต่บน Vercel ระบบจะเรียกใช้ export default app ด้านล่างแทน
if (process.env.NODE_ENV !== 'production') {
    const port = Number(process.env.PORT ?? 3001)
    console.log(`🚀 Server is running on http://localhost:${port}`)
    serve({
        fetch: app.fetch,
        port,
    })
}

// --- 4. Export for Vercel ---
// สำคัญมาก! ห้ามลืมบรรทัดนี้ เพราะ Vercel ต้องการตัวนี้เป็น Entry Point
export default app