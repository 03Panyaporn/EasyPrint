"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const STORAGE_KEY_READ = 'easyprint_notifications_read'
const STORAGE_KEY_DEL = 'easyprint_notifications_deleted'

export function useUnreadNotifications() {
    const [unreadCount, setUnreadCount] = useState(0)

    const fetchCount = async () => {
        try {
            // First fetch shop notification preferences
            const { data: shopData, error: shopError } = await supabase
                .from('shops')
                .select('notify_new_orders, notify_order_cancellations, notify_new_messages')
                .eq('id', 'b9652bb2-cba5-4440-9d89-0f93f598cb67')
                .single()

            if (shopError) console.error("Error fetching shop settings for unread count:", shopError)

            const wantsNewOrders = shopData?.notify_new_orders ?? true
            const wantsCancellations = shopData?.notify_order_cancellations ?? true
            const wantsNewMessages = shopData?.notify_new_messages ?? true

            const { data, error } = await supabase
                .from('orders')
                .select('id, status')
                .in('status', ['รอตรวจสอบสลิป', 'ยกเลิก'])

            let unreadChatCount = 0;
            if (wantsNewMessages) {
                const { data: chatData } = await supabase
                    .from('chat_rooms')
                    .select('id, unread_count')
                    .gt('unread_count', 0);

                if (chatData) {
                    unreadChatCount = chatData.length;
                }
            }

            if (error || !data) {
                setUnreadCount(unreadChatCount);
                return;
            }

            const readIds: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY_READ) || '[]')
            const deletedIds: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY_DEL) || '[]')
            const receivedStr = localStorage.getItem('easyprint_notifications_received')
            const currentReceivedIds: string[] = receivedStr ? JSON.parse(receivedStr) : []

            let hasNewReceived = false;

            const filteredOrders = data.filter(order => {
                const notifId = `${order.id}-${order.status}`;
                if (currentReceivedIds.includes(notifId)) return true;

                let shouldKeep = false;
                if (order.status === 'รอตรวจสอบสลิป' && wantsNewOrders) shouldKeep = true;
                if (order.status === 'ยกเลิก' && wantsCancellations) shouldKeep = true;

                if (shouldKeep) {
                    currentReceivedIds.push(notifId);
                    hasNewReceived = true;
                }
                return shouldKeep;
            })

            const notifIds = filteredOrders.map(order => `${order.id}-${order.status}`)
            const unread = notifIds.filter(id => !readIds.includes(id) && !deletedIds.includes(id))
            setUnreadCount(unread.length + unreadChatCount)

            if (hasNewReceived) {
                localStorage.setItem('easyprint_notifications_received', JSON.stringify(currentReceivedIds));
            }
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
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_rooms' }, () => {
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
