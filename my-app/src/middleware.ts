import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// หน้าที่ต้อง Login ก่อนถึงจะเข้าได้
const protectedPaths = ['/customer', '/shop']

// หน้าที่ Login แล้วไม่ควรเข้า (เช่น หน้า login/register)
const authPaths = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // อ่าน cookies
    const token = request.cookies.get('access_token')?.value
    const role = request.cookies.get('user_role')?.value

    // ─────────────────────────────────────────────
    // 1) ถ้าเข้าหน้า protected (customer, shop) โดยไม่มี token → redirect ไปหน้า login
    // ─────────────────────────────────────────────
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

    if (isProtected && !token) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // ─────────────────────────────────────────────
    // 2) Role-based protection
    // ─────────────────────────────────────────────
    if (token) {
        if (role) {
            // Role exists -> Enforce role boundaries
            if (pathname.startsWith('/shop') && role === 'customer') {
                return NextResponse.redirect(new URL('/customer', request.url))
            }
            if (pathname.startsWith('/customer') && role === 'merchant') {
                return NextResponse.redirect(new URL('/shop', request.url))
            }
        } else if (isProtected) {
            // Token exists but Role is missing -> Likely an old session.
            // Force re-login to set the role cookie for security.
            const loginUrl = new URL('/auth/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    // ─────────────────────────────────────────────
    // 3) ถ้า Login แล้ว แต่เข้าหน้า auth (login/register) → redirect ตาม role
    // ─────────────────────────────────────────────
    const isAuthPage = authPaths.some((path) => pathname.startsWith(path))

    if (isAuthPage && token) {
        const destination = role === 'merchant' ? '/shop' : '/customer'
        return NextResponse.redirect(new URL(destination, request.url))
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
