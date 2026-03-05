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
            const user = JSON.parse(sessionStorage.getItem('user') || '{}')
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
        const user = JSON.parse(sessionStorage.getItem('user') || '{}')
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
        <div className="p-8 max-w-3xl mx-auto min-h-screen bg-gray-50/30">
            {/* Header Section */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 text-[10px] font-bold tracking-widest uppercase mb-3 border border-cyan-100">
                        Chat Center
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        กล่องข้อความ <span className="text-cyan-500">Inbox</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">
                        ตอบกลับลูกค้าและจัดการการสนทนาทั้งหมดในที่เดียว
                    </p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors w-5 h-5" />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อลูกค้า หรืออีเมล..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 pl-10 pr-4 py-3 bg-white border-0 rounded-[16px] text-sm shadow-[0_10px_30px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition-all placeholder:text-gray-400 font-medium"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-[40px] border border-white shadow-sm">
                    <div className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6" />
                    <p className="text-gray-400 font-bold tracking-wide uppercase text-xs">กำลังเตรียมข้อมูลการแชท...</p>
                </div>
            ) : filteredRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-[40px] border border-white shadow-sm text-center px-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[32px] flex items-center justify-center text-gray-300 mb-8 transform rotate-3 shadow-inner">
                        <MessageSquare size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800">ยังไม่มีรายการแชท</h3>
                    <p className="text-gray-500 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
                        เมื่อลูกค้าเริ่มทักแชทสอบถามบริการ รายการแชทจะปรากฏขึ้นที่นี่ เพื่อให้คุณได้ดูแลลูกค้าอย่างรวดเร็ว
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredRooms.map((room) => {
                        const name = room.customer?.raw_user_meta_data?.name || room.customer?.email || `ลูกค้า #${room.customer_id.slice(0, 8)}`;
                        const firstChar = (name[0] || '?').toUpperCase();

                        return (
                            <Link
                                key={room.id}
                                href={`/shop/chat/${room.id}`}
                                className="group bg-white px-5 py-4 rounded-[20px] border border-transparent shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-cyan-500/10 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between relative overflow-hidden"
                            >
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-center gap-3 relative z-10 w-full overflow-hidden">
                                    <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center text-cyan-600 font-black text-base shadow-inner border border-cyan-100/50 group-hover:rotate-6 transition-transform">
                                        {firstChar}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="font-bold text-gray-800 text-sm truncate group-hover:text-cyan-600 transition-colors">
                                                {name}
                                            </h3>
                                            {room.unread_count > 0 && (
                                                <span className="flex items-center justify-center h-4 px-1.5 bg-rose-500 text-white text-[9px] font-black rounded-full shadow-sm">
                                                    {room.unread_count}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 truncate font-medium flex items-center gap-1 min-w-0">
                                            {room.last_message ? (
                                                <span className="truncate">{room.last_message}</span>
                                            ) : (
                                                <span className="italic">ยังไม่มีข้อความ</span>
                                            )}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                                <Clock size={10} className="text-cyan-400" />
                                                {new Date(room.updated_at).toLocaleDateString('th-TH', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 ml-3 w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                                    <ChevronRight size={16} />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
