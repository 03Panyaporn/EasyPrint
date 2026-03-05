import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { exampleRoute } from './routes/example.js'
import { authRoute } from './routes/auth.js'
import { chatRoute } from './routes/chat.js'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use(
    '*',
    cors({
        origin: (origin) => origin, // อนุญาตทุก origin ในช่วงพัฒนา (ช่วยเรื่อง port เปลี่ยน เช่น 3000 -> 3003)
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        credentials: true,
    })
)

// Routes
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

// Start server
const port = Number(process.env.PORT ?? 3001)

console.log(`🚀 Server is running on http://localhost:${port}`)

serve({
    fetch: app.fetch,
    port,
})
