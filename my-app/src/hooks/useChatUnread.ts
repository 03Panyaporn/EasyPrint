import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface UnreadCountProps {
    userId: string | undefined
    userType: 'customer' | 'merchant'
}

export function useChatUnread({ userId, userType }: UnreadCountProps) {
    const [unreadCount, setUnreadCount] = useState(0)
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

    useEffect(() => {
        if (!userId) return

        const fetchUnreadCount = async () => {
            try {
                const param = userType === 'customer' ? `customer_id=${userId}` : `merchant_id=${userId}`
                const res = await fetch(`${API_URL}/api/chat/rooms?${param}`)
                if (res.ok) {
                    const rooms = await res.json()
                    if (Array.isArray(rooms)) {
                        const count = rooms.reduce((acc: number, room: any) => {
                            const val = userType === 'customer' ? room.customer_unread_count : room.unread_count
                            return acc + (val || 0)
                        }, 0)
                        setUnreadCount(count)
                    }
                }
            } catch (err) {
                console.error('Failed to fetch unread count:', err)
            }
        }

        fetchUnreadCount()

        // Subscribe to chat rooms changes
        const channel = supabase
            .channel(`unread-count-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'chat_rooms',
                    filter: `${userType === 'customer' ? 'customer_id' : 'merchant_id'}=eq.${userId}`
                },
                () => {
                    fetchUnreadCount()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, userType, API_URL])

    return unreadCount
}
