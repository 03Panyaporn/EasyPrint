"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    ClipboardList,
    MessageSquare,
    Tags,
    BarChart3,
    Store,
    Bell,
    Settings,
    LogOut,
    Printer,
} from "lucide-react"

const menuItems = [
    { label: "หน้าหลัก", href: "/shop", icon: LayoutDashboard },
    { label: "รายการคำสั่งซื้อ", href: "/shop/orders", icon: ClipboardList },
    { label: "แชท", href: "/shop/chat", icon: MessageSquare },
    { label: "บริการและราคา", href: "/shop/services", icon: Tags },
    { label: "รายงาน", href: "/shop/reports", icon: BarChart3 },
    { label: "จัดการร้านค้า", href: "/shop/manage", icon: Store },
]

const bottomMenuItems = [
    { label: "แจ้งเตือน", href: "/shop/notifications", icon: Bell },
    { label: "ตั้งค่า", href: "/shop/settings", icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname()

    const handleLogout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        document.cookie = 'access_token=; path=/; max-age=0'
        window.location.href = '/'
    }

    const isActive = (href: string) => {
        if (href === '/shop') return pathname === '/shop'
        return pathname.startsWith(href)
    }

    return (
        <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-[#eaf6f8] flex flex-col z-50 shadow-[2px_0_20px_rgba(0,0,0,0.03)]">

            {/* Logo */}
            <div className="flex items-center gap-2.5 px-6 py-6 border-b border-[#eaf6f8]">
                <div className="bg-gradient-to-br from-[#06B6D4] to-[#0891b2] p-2 rounded-xl text-white shadow-md shadow-[#06B6D4]/20">
                    <Printer size={22} />
                </div>
                <span className="text-xl font-bold tracking-tight text-[#455a64]">
                    EASY<span className="text-[#06B6D4]">PRINT</span>
                </span>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${active
                                ? "bg-gradient-to-r from-[#E0F7FA] to-[#E0F3F7] text-[#06B6D4] shadow-sm"
                                : "text-[#78909c] hover:bg-[#f5fbfe] hover:text-[#455a64]"
                                }`}
                        >
                            <Icon
                                size={20}
                                className={`transition-all duration-200 ${active
                                    ? "text-[#06B6D4]"
                                    : "text-[#90a4ae] group-hover:text-[#06B6D4]"
                                    }`}
                            />
                            <span>{item.label}</span>
                            {active && (
                                <div className="ml-auto w-1.5 h-5 bg-[#06B6D4] rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Navigation */}
            <div className="px-3 pb-2 space-y-1 border-t border-[#eaf6f8] pt-3">
                {bottomMenuItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${active
                                ? "bg-gradient-to-r from-[#E0F7FA] to-[#E0F3F7] text-[#06B6D4]"
                                : "text-[#78909c] hover:bg-[#f5fbfe] hover:text-[#455a64]"
                                }`}
                        >
                            <Icon
                                size={20}
                                className={`transition-all duration-200 ${active
                                    ? "text-[#06B6D4]"
                                    : "text-[#90a4ae] group-hover:text-[#06B6D4]"
                                    }`}
                            />
                            <span>{item.label}</span>
                            {item.label === "แจ้งเตือน" && (
                                <span className="ml-auto min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5">
                                    3
                                </span>
                            )}
                        </Link>
                    )
                })}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#78909c] hover:bg-red-50 hover:text-red-500 transition-all duration-200 w-full group"
                >
                    <LogOut
                        size={20}
                        className="text-[#90a4ae] group-hover:text-red-500 transition-all duration-200"
                    />
                    <span>ออกจากระบบ</span>
                </button>
            </div>
        </aside>
    )
}
