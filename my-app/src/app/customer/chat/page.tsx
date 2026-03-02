"use client"

import { useEffect, useState } from "react"
import { Loader2, MessageSquare } from "lucide-react"

export default function CustomerChatRedirect() {
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function startChat() {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}')
                if (!user.id) {
                    window.location.href = '/auth/login'
                    return
                }

                // ดึงรายการร้านค้า (Merchant) เพื่อหาคนแรกมาคุยด้วย
                // ในอนาคตอาจจะส่งไปหน้าเลือกสาขา/ร้านค้า
                const res = await fetch('http://localhost:3001/api/chat/get-or-create-room', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer_id: user.id,
                        merchant_id: 'b9652bb2-cba5-4440-9d89-0f93f598cb67' // สอดคล้องกับตัวอย่าง
                    }),
                })

                if (!res.ok) {
                    const roomData = await res.json()
                    const errorMsg = roomData.details || roomData.error || "ไม่พบร้านค้าที่พร้อมให้บริการ"
                    throw new Error(`${errorMsg}\n\nคำแนะนำ: ${roomData.hint || 'กรุณาตรวจสอบรหัสร้านค้า'}`)
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
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                    <MessageSquare size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">ขออภัยด้วยครับ</h2>
                <p className="text-gray-500 mt-2 max-w-sm">{error}</p>
                <button
                    onClick={() => window.location.href = '/customer'}
                    className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-colors"
                >
                    กลับหน้าหลัก
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-cyan-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">กำลังพาคุณไปที่ห้องแชท...</p>
        </div>
    )
}
