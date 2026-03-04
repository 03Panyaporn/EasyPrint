"use client"

import ChatWindow from '@/components/chat/ChatWindow'
import { use, useState, useEffect } from 'react'

export default function ShopChatPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params)
    const [customerName, setCustomerName] = useState("กำลังโหลด...")

    useEffect(() => {
        async function fetchRoomDetails() {
            try {
                const res = await fetch(`http://localhost:3001/api/chat/rooms`)
                const rooms = await res.json()
                const room = rooms.find((r: any) => r.id === roomId)
                if (room) {
                    setCustomerName(room.customer?.raw_user_meta_data?.name || room.customer?.email || "ลูกค้า")
                }
            } catch (error) {
                console.error("Failed to fetch room details:", error)
                setCustomerName("ลูกค้า")
            }
        }
        fetchRoomDetails()
    }, [roomId])

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 px-2">จัดการแชท</h1>
                <ChatWindow
                    roomId={roomId}
                    senderType="merchant"
                    title={`แชทของลูกค้า: ${customerName}`}
                />
            </div>
        </div>
    )
}
