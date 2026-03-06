'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

function LoginContent({ redirectTo }: { redirectTo: string }) {
    const { login: authLogin } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'เข้าสู่ระบบไม่สำเร็จ')
                return
            }

            authLogin(data.user, data.session)

            if (data.user.role === 'merchant') {
                window.location.href = '/shop'
            } else {
                window.location.href = redirectTo.startsWith('/shop') ? '/customer' : redirectTo
            }
        } catch {
            setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                {/* Logo */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-800">EASY<span className="text-cyan-500">PRINT</span></span>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-800">เข้าสู่ระบบ</h1>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                            อีเมล
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            placeholder="example@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                            รหัสผ่าน
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-cyan-500 text-white font-semibold rounded-xl hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                <div className="mt-3 text-center">
                    <Link
                        href="/auth/forgot-password"
                        className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline font-medium transition-colors"
                    >
                        ลืมรหัสผ่าน?
                    </Link>
                </div>

                <div className="mt-4 text-center text-sm text-gray-500">
                    ยังไม่มีบัญชี?{' '}
                    <Link href="/auth/register" className="text-cyan-600 font-medium hover:underline">
                        สมัครสมาชิก
                    </Link>
                </div>
            </div>
        </div>
    )
}

function LoginWithParams() {
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/customer'
    return <LoginContent redirectTo={redirectTo} />
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
            <LoginWithParams />
        </Suspense>
    )
}
