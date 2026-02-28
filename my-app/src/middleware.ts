import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// หน้าที่ต้อง Login ก่อนถึงจะเข้าได้
const protectedPaths = ['/customer', '/shop']

// หน้าที่ Login แล้วไม่ควรเข้า (เช่น หน้า login/register)
const authPaths = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // อ่าน token จาก cookie
    const token = request.cookies.get('access_token')?.value

    // ─────────────────────────────────────────────
    // 1) ถ้าเข้าหน้า protected (customer, shop) โดยไม่มี token → redirect ไปหน้า login
    // ─────────────────────────────────────────────
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

    if (isProtected && !token) {
        const loginUrl = new URL('/auth/login', request.url)
        // เก็บ URL เดิมไว้ เพื่อ redirect กลับหลัง login สำเร็จ
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // ─────────────────────────────────────────────
    // 2) ถ้า Login แล้ว แต่เข้าหน้า auth (login/register) → redirect ไปหน้าหลัก
    // ─────────────────────────────────────────────
    const isAuthPage = authPaths.some((path) => pathname.startsWith(path))

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/customer', request.url))
    }

    return NextResponse.next()
}

// กำหนดว่า middleware จะทำงานกับ path ไหนบ้าง
export const config = {
    matcher: [
        '/customer/:path*',
        '/shop/:path*',
        '/auth/:path*',
    ],
}
