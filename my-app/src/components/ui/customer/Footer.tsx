"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Footer() {
    const [shopInfo, setShopInfo] = useState<{ maps_url: string | null, phone: string | null }>({
        maps_url: null,
        phone: null
    })

    useEffect(() => {
        supabase
            .from('shops')
            .select('maps_url, phone')
            .eq('id', 'b9652bb2-cba5-4440-9d89-0f93f598cb67')
            .single()
            .then(({ data }) => {
                if (data) {
                    setShopInfo({
                        maps_url: data.maps_url || null,
                        phone: data.phone || null
                    })
                }
            })
    }, [])

    const contactActions = [
        {
            key: 'phone',
            icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41C1.61 3.26 2.39 2.26 3.52 2H6.5a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.55 9.5a16 16 0 0 0 6.91 6.91l.78-.78a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
            action: () => shopInfo.phone && window.open(`tel:${shopInfo.phone}`),
            title: shopInfo.phone || "เบอร์โทรศัพท์",
            show: true
        },
        {
            key: 'mail',
            icon: (
                <>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </>
            ),
            action: () => { },
            title: "อีเมล",
            show: true
        },
        {
            key: 'chat',
            icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
            action: () => { },
            title: "แชท",
            show: true
        },
        {
            key: 'map',
            icon: (
                <>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </>
            ),
            action: () => shopInfo.maps_url && window.open(shopInfo.maps_url, '_blank'),
            title: "ดูตำแหน่งร้านบน Google Maps",
            show: !!shopInfo.maps_url
        }
    ]

    return (
        <footer className="bg-white text-[#455a64] pt-10 pb-6 px-12 border-t border-[#eaf6f8]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0891b2] flex items-center justify-center shadow-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 6 2 18 2 18 9" />
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                <rect x="6" y="14" width="12" height="8" />
                            </svg>
                        </div>
                        <span className="text-[#06B6D4] font-bold text-lg">EASYPRINT</span>
                    </div>
                    <p className="text-[#7eb6c5] text-sm leading-relaxed mb-4">
                        ประสบการณ์ใหม่สำหรับการสั่งพิมพ์งานออนไลน์<br />
                        เพื่อความสะดวกสบาย พร้อมการแจ้งเตือน
                    </p>

                    {shopInfo.phone && (
                        <div className="mb-6 group">
                            <p className="text-xs text-[#7eb6c5] uppercase tracking-wider font-bold mb-1">ติดต่อเรา</p>
                            <a href={`tel:${shopInfo.phone}`} className="text-[#7eb6c5] font-bold text-lg hover:text-[#06B6D4] transition-colors flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.41C1.61 3.26 2.39 2.26 3.52 2H6.5a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.55 9.5a16 16 0 0 0 6.91 6.91l.78-.78a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                {shopInfo.phone}
                            </a>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                        {contactActions.filter(btn => btn.key !== 'phone' && btn.show).map((btn) => (
                            <button
                                key={btn.key}
                                onClick={btn.action}
                                title={btn.title}
                                className="group w-10 h-10 rounded-xl border border-[#eaf6f8] flex items-center justify-center text-[#7eb6c5] hover:text-[#06B6D4] hover:border-[#06B6D4] hover:bg-[#E0F7FA] hover:scale-110 active:scale-95 transition-all duration-200"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {btn.icon}
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-[#06B6D4] font-semibold uppercase tracking-widest text-xs mb-4">PLATFORM</h4>
                    <ul className="space-y-2.5 text-[#7eb6c5] text-sm">
                        {[
                            { name: "ออเดอร์ทั้งหมด", href: "/customer/order" },
                            { name: "ราคาบริการต่างๆ", href: "/customer/pricing" },
                            { name: "ติดตามสถานะ", href: "/customer/tracking" },
                        ].map((item) => (
                            <li key={item.name}>
                                <a href={item.href} className="hover:text-[#06B6D4] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group">
                                    <span className="w-0 group-hover:w-3 h-px bg-[#06B6D4] transition-all duration-200 rounded-full" />
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-[#06B6D4] font-semibold uppercase tracking-widest text-xs mb-4">COMPANY</h4>
                    <ul className="space-y-2.5 text-[#7eb6c5] text-sm">
                        {["Our Vision", "Privacy Policy", "Terms of Use"].map((item) => (
                            <li key={item}>
                                <a href="#" className="hover:text-[#06B6D4] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1.5 group">
                                    <span className="w-0 group-hover:w-3 h-px bg-[#06B6D4] transition-all duration-200 rounded-full" />
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#eaf6f8] text-center text-[#7eb6c5] text-xs">
                © 2026 EasyPrint. All rights reserved.
            </div>
        </footer>
    )
}