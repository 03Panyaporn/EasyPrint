'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, User, Store, Loader2, ChevronRight } from 'lucide-react'

interface Message {
    id: string
    content: string
    sender_type: 'customer' | 'merchant'
    room_id: string
    created_at: string
}

interface ChatWindowProps {
    roomId: string
    senderType: 'customer' | 'merchant'
    title: string
}

export default function ChatWindow({ roomId, senderType, title }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

    useEffect(() => {
        // 1. Fetch history
        async function fetchHistory() {
            try {
                const res = await fetch(`${API_URL}/api/chat/history/${roomId}`)
                if (res.ok) {
                    const data = await res.json()
                    setMessages(data)
                }
            } catch (err) {
                console.error('Failed to fetch history:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchHistory()

        // 2. Setup Realtime
        const channel = supabase
            .channel(`room-${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `room_id=eq.${roomId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message
                    setMessages((current) => {
                        // Avoid duplicates if the sender already added the message locally
                        if (current.find(m => m.id === newMessage.id)) return current
                        return [...current, newMessage]
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId, API_URL])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || isSending) return

        setIsSending(true)
        try {
            const res = await fetch(`${API_URL}/api/chat/send-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newMessage,
                    sender_type: senderType,
                    room_id: roomId,
                }),
            })

            if (res.ok) {
                const savedMessage = await res.json()
                // Update local state for immediate feedback if Realtime is slow
                setMessages((current) => {
                    if (current.find(m => m.id === savedMessage.id)) return current
                    return [...current, savedMessage]
                })
                setNewMessage('')
            }
        } catch (err) {
            console.error('Failed to send message:', err)
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-cyan-600 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors mr-1"
                    >
                        <ChevronRight className="rotate-180" size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        {senderType === 'customer' ? <Store size={20} /> : <User size={20} />}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{title}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-cyan-100">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Online
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <Send size={24} />
                        </div>
                        <p>ยังไม่มีข้อความ เริ่มแชทเลย!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender_type === senderType ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${msg.sender_type === senderType
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                <span className={`text-[10px] mt-1 block opacity-70 ${msg.sender_type === senderType ? 'text-right' : 'text-left'
                                    }`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="พิมพ์ข้อความของคุณที่นี่..."
                        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
                    >
                        {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
            </form>
        </div>
    )
}
