"use client"

import { useState } from "react"
import {
    Search,
    ShoppingCart,
    MessageSquare,
    DollarSign,
    Check,
    XCircle,
    CheckCircle2,
    User,
    ChevronRight,
    LogOut
} from "lucide-react"
import MerchantProfile from "@/components/ui/shop/MerchantProfile"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

// We will fetch data dynamically.
const STORAGE_KEY_READ = 'easyprint_notifications_read';
const STORAGE_KEY_DEL = 'easyprint_notifications_deleted';

export default function NotificationsPage() {
    const router = useRouter()
    const [notifications, setNotifications] = useState<any[]>([])
    const [filter, setFilter] = useState<"all" | "unread">("all")
    const [readIds, setReadIds] = useState<string[]>([])
    const [deletedIds, setDeletedIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const savedRead = localStorage.getItem(STORAGE_KEY_READ)
        if (savedRead) setReadIds(JSON.parse(savedRead))

        const savedDel = localStorage.getItem(STORAGE_KEY_DEL)
        if (savedDel) setDeletedIds(JSON.parse(savedDel))
    }, [])

    const fetchOrdersAsNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`id, created_at, status, order_items(file_name, quantity)`)
                .order('created_at', { ascending: false });

            if (data && !error) {
                const notifs = data
                    .filter(o => o.status === 'รอตรวจสอบสลิป' || o.status === 'ยกเลิก')
                    .map(order => {
                        const isCancel = order.status === 'ยกเลิก';
                        const notifId = `${order.id}-${order.status}`; // Unique ID for event

                        const items = order.order_items || [];
                        const itemCount = items.length;

                        const dateStr = new Date(order.created_at).toISOString().split('T')[0].replace(/-/g, '');
                        const shortId = `ORD-${dateStr}-${order.id.split('-')[0].substring(0, 4).toUpperCase()}`;

                        // Calculate time difference
                        const timeDiff = Date.now() - new Date(order.created_at).getTime();
                        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
                        const timeStr = hours > 0 ? `${hours} ชั่วโมงที่แล้ว` : minutes > 0 ? `${minutes} นาทีที่แล้ว` : `เพิ่งเริ่มต้น`;

                        return {
                            id: notifId,
                            realOrderId: order.id,
                            type: isCancel ? "cancel" : "order",
                            title: isCancel ? "คำสั่งซื้อถูกยกเลิก" : "ได้รับคำสั่งซื้อใหม่",
                            description: isCancel ? `คำสั่งซื้อ ${shortId} ถูกลูกค้ายกเลิกแล้ว` : `คำสั่งซื้อ ${shortId} จากลูกค้า - มีสินค้ารวม ${itemCount} รายการ`,
                            time: timeStr,
                            icon: isCancel ? XCircle : ShoppingCart,
                            iconBg: isCancel ? "bg-red-50/80" : "bg-blue-50/80",
                            iconColor: isCancel ? "text-red-500" : "text-blue-500",
                        }
                    });
                setNotifications(notifs);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchOrdersAsNotifications();

        const channel = supabase
            .channel('notifications_orders_updater')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrdersAsNotifications();
            })
            .subscribe()

        return () => { channel.unsubscribe() }
    }, [])

    const handleMarkAsRead = (id: string) => {
        if (!readIds.includes(id)) {
            const next = [...readIds, id];
            setReadIds(next);
            localStorage.setItem(STORAGE_KEY_READ, JSON.stringify(next));
        }
    }

    const handleDelete = (id: string) => {
        if (!deletedIds.includes(id)) {
            const next = [...deletedIds, id];
            setDeletedIds(next);
            localStorage.setItem(STORAGE_KEY_DEL, JSON.stringify(next));
        }
    }

    const unreadCount = notifications.filter(n => !readIds.includes(n.id) && !deletedIds.includes(n.id)).length

    const handleMarkAllRead = () => {
        const remaining = notifications.filter(n => !deletedIds.includes(n.id)).map(n => n.id);
        const combined = Array.from(new Set([...readIds, ...remaining]));
        setReadIds(combined);
        localStorage.setItem(STORAGE_KEY_READ, JSON.stringify(combined));
    }

    const filteredNotifications = notifications.filter(n => {
        if (deletedIds.includes(n.id)) return false;
        const isUnread = !readIds.includes(n.id);
        if (filter === "unread") return isUnread;
        return true;
    })

    return (
        <div className="p-8 pb-16 bg-[#F8FAFC] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
                <div className="flex-1 mr-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#455a64]">การแจ้งเตือน</h1>
                        <p className="text-[13px] text-gray-500 mt-1">คุณมี {unreadCount} การแจ้งเตือนที่ยังไม่ได้อ่าน</p>
                    </div>
                </div>

                <MerchantProfile />
            </div>

            {/* Notifications Main Container */}
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex justify-end mb-4">
                    <div className="flex items-center gap-5">
                        {/* Toggle */}
                        <div className="flex items-center bg-gray-50/80 p-1.5 rounded-xl border border-gray-100">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'all' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-[#1e293b]' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                ทั้งหมด
                            </button>
                            <button
                                onClick={() => setFilter("unread")}
                                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'unread' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-[#1e293b]' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                ยังไม่ได้อ่าน ({unreadCount})
                            </button>
                        </div>

                        {/* Mark all read button */}
                        <button
                            onClick={handleMarkAllRead}
                            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-5 py-2.5 rounded-[10px] text-[13px] font-bold flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(29,78,216,0.2)]"
                        >
                            <Check size={16} strokeWidth={2.5} />
                            อ่านแล้วทั้งหมด
                        </button>
                    </div>
                </div>
                {/* Notifications List */}
                <div className="space-y-3 pt-2">
                    {filteredNotifications.map((notification) => {
                        const Icon = notification.icon

                        return (
                            <div
                                key={notification.id}
                                onClick={() => {
                                    handleMarkAsRead(notification.id);
                                    if (notification.type === 'order' || notification.type === 'cancel') {
                                        router.push(`/shop/orders?highlight=${notification.realOrderId}`);
                                    }
                                }}
                                className={`bg-white rounded-[14px] p-5 border shadow-sm flex items-center justify-between transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${!readIds.includes(notification.id) ? 'border-l-[5px] border-l-[#1d4ed8] border-y-gray-100 border-r-gray-100' : 'border-gray-100 border-l-[5px] border-l-transparent'}`}
                            >
                                <div className="flex items-center gap-5 ml-1">
                                    <div className={`w-[50px] h-[50px] rounded-[14px] flex items-center justify-center ${notification.iconBg} ${notification.iconColor}`}>
                                        <Icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-[#1e293b] text-[15px]">{notification.title}</h3>
                                        </div>
                                        <p className="text-gray-500 text-[13px] font-medium leading-relaxed my-0.5">{notification.description}</p>
                                        <p className="text-[#94a3b8] text-xs font-medium">{notification.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#1d4ed8] transition-colors" />
                                    {(!readIds.includes(notification.id)) && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}
                                            className="p-2 transition-all group/dot flex items-center justify-center w-10 h-10 hover:bg-blue-50/50 rounded-full"
                                            title="ทำเครื่องหมายว่าอ่านแล้ว"
                                        >
                                            <div className="w-3.5 h-3.5 bg-[#1d4ed8] rounded-full shadow-sm group-hover/dot:scale-110 group-hover/dot:bg-[#1e40af] transition-all" />
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
                                        className="text-[#ef4444] hover:bg-red-50/50 p-1.5 rounded-full transition-colors"
                                        title="ลบการแจ้งเตือน"
                                    >
                                        <XCircle size={22} strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}

                    {filteredNotifications.length === 0 && (
                        <div className="bg-white rounded-[14px] py-16 px-6 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center text-gray-500">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={40} strokeWidth={1.5} className="text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700">ไม่มีอะไรใหม่!</h3>
                            <p className="text-[13px] font-medium mt-2">คุณไม่มีการแจ้งเตือน{filter === 'unread' ? 'ที่ยังไม่ได้อ่าน ' : ''}เหลืออยู่</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
