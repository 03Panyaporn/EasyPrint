import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/customer'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: any) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: any) {
                        cookieStore.set({ name, value: '', ...options })
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // If successful, retrieve the session to set backend cookies if needed
            const { data: { session } } = await supabase.auth.getSession()

            const response = NextResponse.redirect(new URL(next, requestUrl.origin))

            // Since our middleware relies on native cookies 'access_token' and 'user_role', set them:
            if (session) {
                response.cookies.set('access_token', session.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7 // 1 week
                })

                if (session.user?.user_metadata?.role) {
                    response.cookies.set('user_role', session.user.user_metadata.role, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7 // 1 week
                    })
                }
            }
            return response
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL('/auth/login?error=InvalidToken', requestUrl.origin))
}
