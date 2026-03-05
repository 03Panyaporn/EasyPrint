"use client"

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, User, Store, Loader2, Search, MessageSquare, Paperclip, X, FileText, Image as ImageIcon, Download } from 'lucide-react'

interface Message {
    id: string
    room_id: string
    sender_id: string
    sender_type: 'customer' | 'merchant'
    content: string | null
    created_at: string
    is_read: boolean
    file_url?: string | null
    file_name?: string | null
    file_type?: string | null
}

interface ChatRoom {
    id: string
    customer_id: string
    merchant_id: string
    last_message: string
    updated_at: string
    unread_count: number
    customer_unread_count: number
    customer?: {
        email: string
        raw_user_meta_data?: {
            name?: string
        }
    }
}

interface ChatWindowProps {
    roomId: string
    senderType: 'customer' | 'merchant'
    title: string
    hideSidebar?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function ChatWindow({ roomId: initialRoomId, senderType, title: initialTitle, hideSidebar = false }: ChatWindowProps) {
    const [activeRoomId, setActiveRoomId] = useState(initialRoomId)
    const [rooms, setRooms] = useState<ChatRoom[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingRooms, setIsLoadingRooms] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [activeRoomTitle, setActiveRoomTitle] = useState(initialTitle)
    const lastScrolledRoomRef = useRef<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [filePreview, setFilePreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior
            })
        }
    }

    // Fetch rooms for the sidebar
    const fetchRooms = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            if (!user.id) return

            const url = senderType === 'merchant'
                ? `${API_URL}/api/chat/rooms`
                : `${API_URL}/api/chat/rooms?customer_id=${user.id}`

            const res = await fetch(url)
            const data = await res.json()
            setRooms(data)

            // Update active room title if found
            const currentRoom = data.find((r: any) => r.id === activeRoomId)
            if (currentRoom) {
                const name = currentRoom.customer?.raw_user_meta_data?.name || currentRoom.customer?.email || `ลูกค้า #${currentRoom.customer_id.slice(0, 8)}`
                setActiveRoomTitle(senderType === 'merchant' ? name : "EasyPrint Support")
            }
        } catch (error) {
            console.error('Failed to fetch rooms:', error)
        } finally {
            setIsLoadingRooms(false)
        }
    }

    useEffect(() => {
        fetchRooms()

        const channel = supabase
            .channel('chat_rooms_sidebar')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_rooms' }, () => {
                fetchRooms()
            })
            .subscribe()

        return () => { channel.unsubscribe() }
    }, [senderType, activeRoomId])

    // Load messages when active room changes
    useEffect(() => {
        if (!activeRoomId) return

        const fetchMessages = async () => {
            try {
                const res = await fetch(`${API_URL}/api/chat/history/${activeRoomId}`)
                const data = await res.json()
                setMessages(data)
            } catch (err) {
                console.error('Failed to fetch messages:', err)
            } finally {
                setIsLoading(false)
            }
        }

        const markAsRead = async () => {
            try {
                // 1. Reset room unread count
                const p1 = fetch(`${API_URL}/api/chat/mark-as-read`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ room_id: activeRoomId, viewer_type: senderType }),
                })

                // 2. Mark individual messages as read
                const p2 = fetch(`${API_URL}/api/chat/mark-messages-as-read`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ room_id: activeRoomId, viewer_type: senderType }),
                })

                await Promise.all([p1, p2])
            } catch (err) {
                console.error('Failed to mark as read:', err)
            }
        }

        setIsLoading(true)
        fetchMessages()
        markAsRead()

        const channel = supabase
            .channel(`room_${activeRoomId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `room_id=eq.${activeRoomId}`
            }, (payload) => {
                setMessages(prev => {
                    if (prev.find(m => m.id === payload.new.id)) return prev
                    return [...prev, payload.new as Message]
                })
                markAsRead()
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'messages',
                filter: `room_id=eq.${activeRoomId}`
            }, (payload) => {
                setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m))
            })
            .subscribe()

        return () => { channel.unsubscribe() }
    }, [activeRoomId, senderType])

    useEffect(() => {
        if (messages.length > 0) {
            const isInitialLoad = lastScrolledRoomRef.current !== activeRoomId
            scrollToBottom(isInitialLoad ? 'auto' : 'smooth')
            lastScrolledRoomRef.current = activeRoomId
        }
    }, [messages, activeRoomId])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setSelectedFile(file)
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (ev) => setFilePreview(ev.target?.result as string)
            reader.readAsDataURL(file)
        } else {
            setFilePreview(null)
        }
        e.target.value = ''
    }

    const clearSelectedFile = () => {
        setSelectedFile(null)
        setFilePreview(null)
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() && !selectedFile || isSending) return

        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (!user.id) return

        setIsSending(true)
        try {
            let file_url: string | undefined
            let file_name: string | undefined
            let file_type: string | undefined

            // 1. Upload file if any
            if (selectedFile) {
                setIsUploading(true)
                const formData = new FormData()
                formData.append('file', selectedFile)
                const uploadRes = await fetch(`${API_URL}/api/chat/upload`, {
                    method: 'POST',
                    body: formData,
                })
                const uploadData = await uploadRes.json()
                if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed')
                file_url = uploadData.url
                file_name = uploadData.name
                file_type = uploadData.type
                setIsUploading(false)
            }

            // 2. Send message
            const res = await fetch(`${API_URL}/api/chat/send-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    room_id: activeRoomId,
                    sender_id: user.id,
                    sender_type: senderType,
                    content: newMessage || undefined,
                    file_url,
                    file_name,
                    file_type,
                }),
            })

            if (res.ok) {
                setNewMessage('')
                clearSelectedFile()
            }
        } catch (err) {
            console.error('Failed to send message:', err)
        } finally {
            setIsSending(false)
            setIsUploading(false)
        }
    }

    const filteredRooms = rooms.filter(room => {
        const name = room.customer?.raw_user_meta_data?.name || room.customer?.email || room.customer_id;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    })

    return (
        <div className="flex w-full h-full bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.12)] overflow-hidden border border-gray-100 relative">

            {/* Sidebar — hidden for customer (single shop) */}
            {!hideSidebar && (
                <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
                    <div className="p-6">
                        <h2 className="text-xl font-black text-gray-900 mb-4 px-1">แชท</h2>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-cyan-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="ค้นหาชื่อลูกค้า..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-[13px] shadow-sm focus:ring-2 focus:ring-cyan-500/10 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 pb-6 space-y-1 scrollbar-hide">
                        {isLoadingRooms ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-20 bg-gray-100/50 animate-pulse rounded-2xl mb-2" />
                            ))
                        ) : filteredRooms.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                <MessageSquare size={32} strokeWidth={1.5} />
                                <p className="text-[10px] font-bold uppercase tracking-wider mt-2">ไม่พบแชท</p>
                            </div>
                        ) : (
                            filteredRooms.map((room) => {
                                const isSelected = room.id === activeRoomId;
                                const name = room.customer?.raw_user_meta_data?.name || room.customer?.email || `ลูกค้า #${room.customer_id.slice(0, 8)}`;
                                const unread = senderType === 'merchant' ? room.unread_count : room.customer_unread_count;

                                return (
                                    <button
                                        key={room.id}
                                        onClick={() => {
                                            setActiveRoomId(room.id);
                                            setActiveRoomTitle(senderType === 'merchant' ? name : "EasyPrint Support");
                                        }}
                                        className={`w-full p-4 rounded-[24px] transition-all duration-300 flex items-center gap-4 group/item ${isSelected
                                            ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg'
                                            : 'hover:bg-white text-gray-600'
                                            }`}
                                    >
                                        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${isSelected ? 'bg-white/20' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {(name[0] || '?').toUpperCase()}
                                        </div>
                                        <div className="flex-1 text-left overflow-hidden">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className={`font-black text-[13px] truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                                    {name}
                                                </span>
                                                {unread > 0 && (
                                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${isSelected ? 'bg-white text-cyan-600' : 'bg-rose-500 text-white'
                                                        }`}>
                                                        {unread}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-[11px] truncate ${isSelected ? 'text-cyan-50' : 'text-gray-400 font-medium'}`}>
                                                {room.last_message || "ยังไม่มีข้อความ"}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white relative">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-cyan-50/5 via-transparent to-blue-50/5 pointer-events-none" />

                {/* Header */}
                <div className="h-24 px-8 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-20">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                                {senderType === 'customer' ? <Store size={24} /> : <User size={24} />}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-400 border-[3px] border-white"></span>
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-gray-900 leading-tight">{activeRoomTitle}</h3>
                            <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide relative z-10"
                >
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="animate-spin text-cyan-500" size={32} />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <Send size={48} className="text-gray-200 mb-4 transform -rotate-12" />
                            <h4 className="text-lg font-black text-gray-800">ส่งข้อความได้เลย</h4>
                            <p className="text-sm text-gray-400 max-w-[240px] mt-1">เริ่มต้นการสนทนากับร้านค้าหรือลูกค้าได้ทันที</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender_type === senderType;
                            const isImage = msg.file_type?.startsWith('image/')
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                        {/* File/Image content */}
                                        {msg.file_url && (
                                            isImage ? (
                                                <a href={msg.file_url} target="_blank" rel="noreferrer" className="block mb-1">
                                                    <img
                                                        src={msg.file_url}
                                                        alt={msg.file_name || 'รูปภาพ'}
                                                        className="max-w-[280px] max-h-[240px] rounded-[20px] object-cover shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                                                    />
                                                </a>
                                            ) : (
                                                <a
                                                    href={msg.file_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    download={msg.file_name || true}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-[20px] shadow-sm mb-1 max-w-[280px] ${isMe ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    <FileText size={24} className="shrink-0 opacity-80" />
                                                    <span className="text-[13px] font-semibold truncate flex-1">{msg.file_name || 'ไฟล์แนบ'}</span>
                                                    <Download size={16} className="shrink-0 opacity-70" />
                                                </a>
                                            )
                                        )}
                                        {/* Text content */}
                                        {msg.content && (
                                            <div className={`px-5 py-3 rounded-[24px] text-[15px] shadow-sm ${isMe ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                                }`}>
                                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 mt-1.5 px-2">
                                            <span className="text-[10px] font-bold text-gray-300 uppercase">
                                                {new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isMe && (
                                                <span className={`text-[10px] font-black uppercase tracking-tighter ${msg.is_read ? 'text-cyan-500' : 'text-gray-300'}`}>
                                                    {msg.is_read ? 'อ่านแล้ว' : 'ยังไม่อ่าน'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Input */}
                <div className="px-8 pb-8 bg-white relative z-20">
                    {/* File Preview */}
                    {selectedFile && (
                        <div className="mb-3 flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-3">
                            {filePreview ? (
                                <img src={filePreview} alt="preview" className="w-14 h-14 object-cover rounded-xl shrink-0" />
                            ) : (
                                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                    <FileText size={24} className="text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1 overflow-hidden">
                                <p className="text-[13px] font-bold text-gray-800 truncate">{selectedFile.name}</p>
                                <p className="text-[11px] text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button onClick={clearSelectedFile} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                                <X size={14} className="text-gray-600" />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="flex items-end gap-3 bg-gray-50 p-2 rounded-[28px] border border-gray-100 focus-within:bg-white focus-within:ring-8 focus-within:ring-cyan-500/5 focus-within:border-cyan-500/20 transition-all duration-300">
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        {/* Paperclip button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-cyan-500 hover:bg-cyan-50 transition-all shrink-0 ml-1"
                        >
                            <Paperclip size={20} />
                        </button>
                        <textarea
                            rows={1}
                            value={newMessage}
                            onChange={(e) => {
                                setNewMessage(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="พิมพ์ข้อความของคุณที่นี่..."
                            className="flex-1 bg-transparent px-3 py-4 text-[15px] outline-none resize-none max-h-32 min-h-[56px] placeholder:text-gray-400 font-medium"
                        />
                        <button
                            type="submit"
                            disabled={(!newMessage.trim() && !selectedFile) || isSending}
                            className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/20 disabled:opacity-20 transition-all active:scale-90 flex items-center justify-center shrink-0"
                        >
                            {(isSending || isUploading) ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
