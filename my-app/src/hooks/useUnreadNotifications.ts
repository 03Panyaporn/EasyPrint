"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const STORAGE_KEY_READ = 'easyprint_notifications_read'
const STORAGE_KEY_DEL = 'easyprint_notifications_deleted'

export function useUnreadNotifications() {
    const [unreadCount, setUnreadCount] = useState(0)

    const fetchCount = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('id, status')
                .in('status', ['รอตรวจสอบสลิป', 'ยกเลิก'])

            if (error || !data) return

            const readIds: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY_READ) || '[]')
            const deletedIds: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY_DEL) || '[]')

            const notifIds = data.map(order => `${order.id}-${order.status}`)
            const unread = notifIds.filter(id => !readIds.includes(id) && !deletedIds.includes(id))
            setUnreadCount(unread.length)
        } catch (err) {
            console.error('Error fetching unread notifications:', err)
        }
    }

    useEffect(() => {
        fetchCount()

        // Listen for order changes
        const channel = supabase
            .channel('sidebar_notifications_count')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchCount()
            })
            .subscribe()

        // Listen for localStorage changes (when user reads/deletes from notifications page)
        const handleStorageChange = () => fetchCount()
        window.addEventListener('storage', handleStorageChange)

        // Poll every 5 seconds to catch same-tab localStorage changes
        const interval = setInterval(fetchCount, 5000)

        return () => {
            channel.unsubscribe()
            window.removeEventListener('storage', handleStorageChange)
            clearInterval(interval)
        }
    }, [])

    return unreadCount
}
