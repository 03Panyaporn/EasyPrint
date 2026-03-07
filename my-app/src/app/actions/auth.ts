'use server'

import { cookies } from 'next/headers'

export async function setAuthCookie(token: string, role: string) {
    const cookieStore = await cookies()
    cookieStore.set('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    cookieStore.set('user_role', role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })
}

export async function removeAuthCookie() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
    cookieStore.delete('user_role')
}
