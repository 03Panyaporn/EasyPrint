"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MessageSquare, User, Clock, ChevronRight, Search } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ChatRoom {
    id: string
    created_at: string
    updated_at: string
    last_message: string
    unread_count: number
    customer_id: string
    customer?: {
        id: string
        email: string
        raw_user_meta_data: {
            name?: string
        }
    }
}

export default function ShopInboxPage() {
    const [rooms, setRooms] = useState<ChatRoom[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchRooms()
    }, [])

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

    const fetchRooms = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            console.log("🏪 Shop Inbox - Logged in as:", user.id, user.email)

            const res = await fetch(`${API_URL}/api/chat/rooms?merchant_id=${user.id}`)
            const data = await res.json()
            if (Array.isArray(data)) {
                setRooms(data)
            }
        } catch (error) {
            console.error("Failed to fetch rooms:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.id) return

        // Subscribe to new rooms for this merchant
        const channel = supabase
            .channel('shop-inbox')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'chat_rooms',
                    filter: `merchant_id=eq.${user.id}`
                },
                () => {
                    console.log("🔄 Realtime: Chat rooms updated, fetching again...")
                    fetchRooms()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const filteredRooms = rooms.filter(room =>
        room.customer?.raw_user_meta_data?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">กล่องข้อความ</h1>
                    <p className="text-gray-500 text-sm mt-1">จัดการการพูดคุยกับลูกค้าทั้งหมด</p>
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="ค้นหาลูกค้า..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-500 text-sm">กำลังโหลดรายการแชท...</p>
                </div>
            ) : filteredRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                        <MessageSquare size={32} />
                    </div>
                    <h3 className="text-gray-800 font-bold">ไม่มีรายการแชท</h3>
                    <p className="text-gray-500 text-sm mt-1">เมื่อลูกค้าทักแชทมา จะปรากฏห้องแชทที่นี่</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredRooms.map((room) => (
                        <Link
                            key={room.id}
                            href={`/shop/chat/${room.id}`}
                            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-cyan-500/30 transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold shadow-inner uppercase">
                                    {room.customer?.raw_user_meta_data?.name?.[0] || room.customer?.email?.[0] || <User size={20} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-800">
                                            {room.customer?.raw_user_meta_data?.name || room.customer?.email || `ลูกค้า #${room.customer_id.slice(0, 8)}`}
                                        </h3>
                                        {room.unread_count > 0 && (
                                            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                {room.unread_count}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate max-w-md mt-0.5">
                                        {room.last_message || "ยังไม่มีข้อความ"}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                            <Clock size={12} />
                                            {new Date(room.updated_at).toLocaleDateString('th-TH', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                <ChevronRight size={18} />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
