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
    User
} from "lucide-react"

// Initial dummy data matching the screenshot
const initialNotifications = [
    {
        id: 1,
        type: "order",
        title: "ได้รับคำสั่งซื้อใหม่",
        description: "คำสั่งซื้อ #ORD005 จาก ภานุวัฒน์ - พิมพ์สี 200 แผ่น",
        time: "2 ชั่วโมงที่แล้ว",
        unread: true,
        icon: ShoppingCart,
        iconBg: "bg-blue-50/80",
        iconColor: "text-blue-500",
    },
    {
        id: 2,
        type: "message",
        title: "ข้อความใหม่",
        description: "สมชาย ส่งข้อความถึงคุณ",
        time: "2 ชั่วโมงที่แล้ว",
        unread: true,
        icon: MessageSquare,
        iconBg: "bg-purple-50/80",
        iconColor: "text-purple-500",
    },
    {
        id: 3,
        type: "payment",
        title: "ได้รับการชำระเงิน",
        description: "ได้รับการชำระเงินจำนวน 350.00 บาท สำหรับคำสั่งซื้อ #ORD002",
        time: "3 ชั่วโมงที่แล้ว",
        unread: false,
        icon: DollarSign,
        iconBg: "bg-green-50/80",
        iconColor: "text-green-500",
    },
    {
        id: 4,
        type: "order",
        title: "ได้รับคำสั่งซื้อใหม่",
        description: "คำสั่งซื้อ #ORD001 จาก สมชาย - พิมพ์สี 50 แผ่น",
        time: "4 ชั่วโมงที่แล้ว",
        unread: false,
        icon: ShoppingCart,
        iconBg: "bg-blue-50/80",
        iconColor: "text-blue-500",
    }
]

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications)
    const [filter, setFilter] = useState<"all" | "unread">("all")

    const handleMarkAsRead = (id: number) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, unread: false } : n
        ))
    }

    const handleDelete = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })))
    }

    const unreadCount = notifications.filter(n => n.unread).length

    const filteredNotifications = notifications.filter(n => {
        if (filter === "unread") return n.unread
        return true
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

                <div className="flex items-center gap-4 px-2 border-l border-[#e5e7eb] pl-6">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-[#455a64]">Shop EasyPrint</p>
                        <p className="text-[11px] font-medium text-gray-400">Test User</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#06B6D4] flex items-center justify-center text-white shadow-md">
                        <User size={20} />
                    </div>
                </div>
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
                                className={`bg-white rounded-[14px] p-5 border shadow-sm flex items-center justify-between transition-all hover:-translate-y-0.5 hover:shadow-md ${notification.unread ? 'border-l-[5px] border-l-[#1d4ed8] border-y-gray-100 border-r-gray-100' : 'border-gray-100 border-l-[5px] border-l-transparent'}`}
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

                                <div className="flex items-center gap-4">
                                    {notification.unread && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="p-2 transition-all group/dot flex items-center justify-center w-10 h-10 hover:bg-blue-50/50 rounded-full"
                                            title="ทำเครื่องหมายว่าอ่านแล้ว"
                                        >
                                            <div className="w-3.5 h-3.5 bg-[#1d4ed8] rounded-full shadow-sm group-hover/dot:scale-110 group-hover/dot:bg-[#1e40af] transition-all" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(notification.id)}
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
