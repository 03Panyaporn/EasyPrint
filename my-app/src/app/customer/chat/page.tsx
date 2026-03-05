"use client"

import { useEffect, useState } from "react"
import { Loader2, MessageSquare } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const MERCHANT_ID = 'b9652bb2-cba5-4440-9d89-0f93f598cb67'

export default function CustomerChatRedirect() {
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function startChat() {
            try {
                const user = JSON.parse(sessionStorage.getItem('user') || '{}')
                if (!user.id) {
                    window.location.href = '/auth/login'
                    return
                }

                const res = await fetch(`${API_URL}/api/chat/get-or-create-room`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer_id: user.id,
                        merchant_id: MERCHANT_ID
                    }),
                })

                if (!res.ok) {
                    const roomData = await res.json()
                    throw new Error(roomData.details || roomData.error || "ไม่พบร้านค้าที่พร้อมให้บริการ")
                }

                const room = await res.json()
                if (room.id) {
                    window.location.href = `/customer/chat/${room.id}`
                } else {
                    throw new Error("สร้างห้องแชทไม่สำเร็จ")
                }
            } catch (err: any) {
                console.error("Chat redirect error:", err)
                setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ")
            }
        }

        startChat()
    }, [])

    if (error) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-14 h-14 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center mb-4">
                    <MessageSquare size={28} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">เกิดข้อผิดพลาด</h2>
                <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">{error}</p>
                <button
                    onClick={() => window.location.href = '/customer'}
                    className="mt-6 px-5 py-2.5 bg-cyan-600 text-white text-sm rounded-xl font-bold hover:bg-cyan-700 transition-colors"
                >
                    กลับหน้าหลัก
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl flex items-center justify-center border border-cyan-100">
                <Loader2 className="w-7 h-7 text-cyan-500 animate-spin" />
            </div>
            <p className="text-gray-400 text-sm font-medium">กำลังพาคุณไปที่ห้องแชท...</p>
        </div>
    )
}
