'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error || 'เกิดข้อผิดพลาด')
                return
            }

            setSent(true)
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
                    <h1 className="text-xl font-semibold text-gray-800">ลืมรหัสผ่าน?</h1>
                    <p className="text-sm text-gray-500 mt-1">กรอกอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้</p>
                </div>

                {sent ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">ส่งอีเมลแล้ว!</h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                            หากอีเมล <span className="font-semibold text-gray-700">{email}</span> มีอยู่ในระบบ คุณจะได้รับลิงก์รีเซ็ตรหัสผ่านในไม่ช้า กรุณาตรวจสอบกล่องจดหมาย (รวมถึง Spam)
                        </p>
                        <Link
                            href="/auth/login"
                            className="w-full inline-block text-center py-2.5 bg-cyan-500 text-white font-semibold rounded-xl hover:bg-cyan-600 transition-colors text-sm"
                        >
                            กลับไปหน้าเข้าสู่ระบบ
                        </Link>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                    autoFocus
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                    placeholder="example@email.com"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 bg-cyan-500 text-white font-semibold rounded-xl hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {loading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                            </button>
                        </form>

                        <div className="mt-5 text-center">
                            <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                ← กลับไปหน้าเข้าสู่ระบบ
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
