'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginContent() {
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/customer'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'เข้าสู่ระบบไม่สำเร็จ')
                return
            }

            // เก็บใน localStorage (สำหรับ client-side)
            localStorage.setItem('access_token', data.session.access_token)
            localStorage.setItem('refresh_token', data.session.refresh_token)
            localStorage.setItem('user', JSON.stringify(data.user))

            // เก็บใน cookie (สำหรับ middleware server-side)
            document.cookie = `access_token=${data.session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
            document.cookie = `user_role=${data.user.role || 'customer'}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

            // Redirect ตามบทบาท (Role)
            if (data.user.role === 'merchant') {
                window.location.href = '/shop'
            } else {
                window.location.href = redirectTo
            }
        } catch {
            setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
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
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="กรอกอีเมลของคุณ"
                            required
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="กรอกรหัสผ่านของคุณ"
                            required
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all text-sm"
                        />
                    </div>

                    <div className="text-right">
                        <a href="#" className="text-xs text-cyan-500 hover:text-cyan-600 transition-colors">
                            ลืมรหัสผ่าน?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                {/* Register Link */}
                <p className="text-center text-gray-500 text-xs mt-5">
                    ยังไม่มีบัญชี?{' '}
                    <Link href="/auth/register" className="text-cyan-500 hover:text-cyan-600 font-medium transition-colors">
                        สมัครสมาชิก
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-800">EASY<span className="text-cyan-500">PRINT</span></span>
                    </Link>
                    <div className="flex items-center gap-6 text-sm font-medium">
                        <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">หน้าแรก</Link>
                        <Link href="/auth/login" className="text-cyan-500 hover:text-cyan-600 transition-colors">เข้าระบบ</Link>
                        <Link href="/auth/register" className="text-cyan-500 hover:text-cyan-600 transition-colors">สมัครสมาชิก</Link>
                    </div>
                </div>
            </nav>

            {/* Background + Modal */}
            <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4"><div className="animate-pulse">Loading...</div></div>}>
                <LoginContent />
            </Suspense>
        </div>
    )
}
