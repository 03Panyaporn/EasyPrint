import { Hono } from 'hono'

export const exampleRoute = new Hono()

// GET /api/example
exampleRoute.get('/', (c) => {
    return c.json({
        message: 'This is an example route',
        data: [
            { id: 1, name: 'Item A' },
            { id: 2, name: 'Item B' },
        ],
    })
})

// GET /api/example/:id
exampleRoute.get('/:id', (c) => {
    const id = c.req.param('id')
    return c.json({ id, name: `Item ${id}` })
})

// POST /api/example
exampleRoute.post('/', async (c) => {
    const body = await c.req.json()
    return c.json({ message: 'Created successfully', data: body }, 201)
})
