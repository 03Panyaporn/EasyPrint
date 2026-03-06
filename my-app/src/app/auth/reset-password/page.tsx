'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function ResetPasswordContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [sessionReady, setSessionReady] = useState(false)

    // Supabase sends the access_token in the URL hash after redirecting from email link
    useEffect(() => {
        const hash = window.location.hash
        if (hash) {
            // Parse hash fragment: #access_token=...&type=recovery
            const params = new URLSearchParams(hash.substring(1))
            const access_token = params.get('access_token')
            const refresh_token = params.get('refresh_token')
            const type = params.get('type')

            if (type === 'recovery' && access_token && refresh_token) {
                supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
                    if (error) {
                        setError('ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว')
                    } else {
                        setSessionReady(true)
                    }
                })
            } else {
                setError('ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้อง')
            }
        } else {
            setError('ไม่พบ token สำหรับรีเซ็ตรหัสผ่าน กรุณาคลิกลิงก์จากอีเมลอีกครั้ง')
        }
    }, [])

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirm) {
            setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน')
            return
        }
        if (password.length < 8) {
            setError('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
            return
        }

        setLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error

            setSuccess(true)
            setTimeout(() => router.push('/auth/login'), 3000)
        } catch (err: any) {
            setError(err.message || 'ไม่สามารถรีเซ็ตรหัสผ่านได้')
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
                    <h1 className="text-xl font-semibold text-gray-800">ตั้งรหัสผ่านใหม่</h1>
                    <p className="text-sm text-gray-500 mt-1">กรอกรหัสผ่านใหม่ของคุณด้านล่าง</p>
                </div>

                {success ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">เปลี่ยนรหัสผ่านสำเร็จ!</h2>
                        <p className="text-sm text-gray-500">กำลังพาคุณไปยังหน้าเข้าสู่ระบบ...</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {sessionReady && (
                            <form onSubmit={handleReset} className="space-y-4">
                                <div>
                                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        รหัสผ่านใหม่
                                    </label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                        placeholder="อย่างน้อย 8 ตัวอักษร"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        ยืนยันรหัสผ่านใหม่
                                    </label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
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
                                    {loading ? 'กำลังรีเซ็ต...' : 'ยืนยันรหัสผ่านใหม่'}
                                </button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}
