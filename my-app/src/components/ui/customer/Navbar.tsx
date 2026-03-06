"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { useChatUnread } from "@/hooks/useChatUnread"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"

const SHOP_ID = "b9652bb2-cba5-4440-9d89-0f93f598cb67"

export default function Navbar() {
    const { cartCount } = useCart();
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const { user, logout } = useAuth()
    const [isShopOpen, setIsShopOpen] = useState(true)

    // Use the custom hook for unread count
    const unreadCount = useChatUnread({ userId: user?.id, userType: 'customer' })

    const handleLogout = async () => {
        await logout()
    }

    useEffect(() => {
        const fetchStatus = async () => {
            const { data } = await supabase
                .from('shops')
                .select('is_open')
                .eq('id', SHOP_ID)
                .single()
            if (data) setIsShopOpen(data.is_open)
        }
        fetchStatus()

        // Realtime subscription
        const channel = supabase.channel('shop-status-customer')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'shops',
                filter: `id=eq.${SHOP_ID}`
            }, (payload) => {
                if (payload.new && typeof payload.new.is_open === 'boolean') {
                    setIsShopOpen(payload.new.is_open)
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div className="bg-white">
            {/* Top status bar */}
            <div className="py-1.5 px-8 flex items-center gap-2 border-b border-gray-100 bg-gray-50/50">
                <span className="relative flex h-3 w-3">
                    {isShopOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isShopOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </span>
                <span className={`text-sm font-medium ${isShopOpen ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isShopOpen ? 'ร้านค้าเปิดบริการ' : 'ร้านค้าปิดบริการชั่วคราว'}
                </span>
            </div>

            {/* Main Navbar */}
            <nav className="bg-white border-b border-[#D9D9D9] px-8 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-white/95">
                {/* โลโก้ EASYPRINT */}
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0891b2] flex items-center justify-center shadow-md group-hover:shadow-[#06B6D4]/40 group-hover:scale-105 transition-all duration-300">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                        </svg>
                    </div>
                    <span className="text-[#06B6D4] font-bold text-xl tracking-wide group-hover:text-[#0891b2] transition-colors duration-200">EASYPRINT</span>
                </div>

                {/* เมนูนำทางกลาง */}
                <div className="flex items-center gap-8 text-gray-500 font-medium text-sm">
                    {[
                        { label: "หน้าหลัก", href: "/customer" },
                        { label: "สั่งพิมพ์", href: "/customer/order" },
                        { label: "แชท", href: "/customer/chat" },
                        { label: "ติดตามสถานะ", href: "/customer/tracking" },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="relative py-1 hover:text-[#06B6D4] transition-colors duration-200 group flex items-center gap-1.5"
                        >
                            {item.label}
                            {item.label === "แชท" && unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#06B6D4] rounded-full transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* ไอคอนและปุ่มด้านขวา */}
                <div className="flex items-center gap-3">

                    {/* ปุ่มตะกร้า — เชื่อมกับ /customer/cart */}
                    <div className="relative group">
                        <Link
                            href="/customer/cart"
                            className="w-10 h-10 rounded-2xl bg-[#E0F3F7] border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] shadow-sm cursor-pointer hover:bg-[#d1e9ed] transition-colors"
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                        </Link>
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] min-h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1 shadow-sm pointer-events-none">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                            ตะกร้าสินค้า
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                        </div>
                    </div>

                    {/* ปุ่มออกจากระบบ */}
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="group flex items-center gap-2 border border-[#D9D9D9] rounded-full px-4 py-2 text-sm text-gray-500 hover:border-red-400 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all duration-200 shadow-sm"
                    >
                        <svg
                            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="group-hover:translate-x-0.5 transition-transform duration-200"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span className="group-hover:tracking-wide transition-all duration-200">ออกจากระบบ</span>
                    </button>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-[400px] rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-[#455a64] mb-2">ยืนยันการออกจากระบบ?</h3>
                            <p className="text-sm text-[#90a4ae] leading-relaxed mb-8">
                                คุณแน่ใจหรือไม่ที่จะออกจากระบบ?<br />
                                คุณจะต้องเข้าสู่ระบบใหม่เพื่อใช้งานฟีเจอร์ต่างๆ
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 py-4 bg-gray-50 text-[#90a4ae] rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                                >
                                    ยืนยันออกระบบ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}