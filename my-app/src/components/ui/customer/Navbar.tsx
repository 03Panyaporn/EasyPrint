"use client"
import { useState } from "react"
import Link from "next/link"

export default function Navbar() {
    const [cartCount] = useState(0); // TODO: เชื่อมกับ cart state จริงในอนาคต

    return (
        <div className="bg-white">
            {/* Top status bar */}
            <div className="bg-gradient-to-r from-[#E0F3F7] to-[#F0FAFB] py-1.5 px-6 flex items-center gap-2.5 border-b border-[#d1e9ed]">
                <div className="w-10 h-5 bg-[#06B6D4] rounded-full flex items-center px-0.5 shadow-inner cursor-pointer hover:bg-[#0891b2] transition-colors duration-200">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                </div>
                <span className="text-sm text-[#7eb6c5]">สถานะร้านค้า : <span className="text-[#06B6D4] font-semibold">เปิดบริการ</span></span>
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
                            className="relative py-1 hover:text-[#06B6D4] transition-colors duration-200 group"
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#06B6D4] rounded-full transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* ไอคอนและปุ่มด้านขวา */}
                <div className="flex items-center gap-3">

                    {/* ปุ่มที่อยู่ */}
                    <div className="relative group">
                        <button className="w-10 h-10 rounded-2xl bg-[#E0F3F7] border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] shadow-sm cursor-pointer hover:bg-[#d1e9ed] transition-colors">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </button>
                        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                            ที่อยู่จัดส่ง
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                        </div>
                    </div>

                    {/* ปุ่มตะกร้า */}
                    <div className="relative group">
                        <button className="w-10 h-10 rounded-2xl bg-[#E0F3F7] border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] shadow-sm cursor-pointer hover:bg-[#d1e9ed] transition-colors">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                        </button>
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] min-h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1 shadow-sm">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                            ตะกร้าสินค้า
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                        </div>
                    </div>

                    {/* ปุ่มออกจากระบบ */}
                    <button className="group flex items-center gap-2 border border-[#D9D9D9] rounded-full px-4 py-2 text-sm text-gray-500 hover:border-red-400 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all duration-200 shadow-sm">
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
        </div>
    )
}
