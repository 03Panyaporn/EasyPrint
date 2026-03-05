"use client"

import ChatWindow from '@/components/chat/ChatWindow'
import { use, useState, useEffect } from 'react'
import { User, Store } from 'lucide-react'

export default function ShopChatPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params)
    const [customerName, setCustomerName] = useState("กำลังโหลด...")

    useEffect(() => {
        async function fetchRoomDetails() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/chat/rooms`)
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
        <div className="h-screen bg-[#f1f5f9] p-4 sm:p-8">
            <div className="max-w-[1600px] mx-auto h-full">
                <ChatWindow
                    roomId={roomId}
                    senderType="merchant"
                    title={customerName}
                />
            </div>
        </div>
    )
}
