"use client"
import { useState } from "react"
import Link from "next/link"
import { MapPin, ShoppingCart, LogOut, Printer, Pencil, Trash2, PlusCircle } from "lucide-react"

export default function Navbar() {
    const [isLocationOpen, setIsLocationOpen] = useState(false);

    return (
        <div className="bg-white">
            {/* Top status bar */}
            <div className="bg-[#e6f3f5] text-[#7eb6c5] px-8 py-2 text-sm flex items-center gap-2 border-b border-[#d1e9ed]">
                <div className="w-8 h-4 bg-[#4ade80] rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
                <span>สถานะร้านค้า : เปิดบริการ</span>
            </div>

            {/* Main navbar */}
            <nav className="flex justify-between items-center px-8 py-4 border-b border-[#eaf6f8]">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="bg-[#21b4d0] p-2 rounded-2xl text-white shadow-lg">
                        <Printer size={28} />
                    </div>
                    <div className="text-2xl font-bold tracking-tight text-[#455a64]">
                        EASY<span className="text-[#21b4d0]">PRINT</span>
                    </div>
                </div>

                {/* Nav Links */}
                <div className="flex items-center gap-10 font-medium text-[#7eb6c5]">
                    <Link href="/customer" className="hover:text-[#21b4d0]">หน้าหลัก</Link>
                    <Link href="/customer/order" className="hover:text-[#21b4d0]">สั่งพิมพ์</Link>
                    <Link href="/customer/chat" className="hover:text-[#21b4d0]">แชท</Link>
                    <Link href="/customer/tracking" className="hover:text-[#21b4d0]">ติดตามสถานะ</Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 relative">
                        {/* MapPin Button with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLocationOpen(!isLocationOpen)}
                                className={`p-2.5 rounded-xl transition-colors ${isLocationOpen ? 'bg-[#d1e9ed] text-[#21b4d0]' : 'bg-[#eaf6f8] text-[#21b4d0] hover:bg-[#d1e9ed]'}`}
                            >
                                <MapPin size={24} />
                            </button>

                            {/* Location Dropdown Popup */}
                            {isLocationOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsLocationOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-4 w-[340px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#d1e9ed] z-50 p-6 overflow-hidden">
                                        <div className="space-y-6">
                                            {/* Location Item 1 */}
                                            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                                                <div className="bg-[#f5fbfe] text-[#7eb6c5] p-2 rounded-full border border-[#eaf6f8] mt-1">
                                                    <MapPin size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-[#455a64] text-base">บ้าน</span>
                                                        <Link href="/customer/edit-location" onClick={() => setIsLocationOpen(false)}>
                                                            <Pencil size={16} className="text-[#7eb6c5] cursor-pointer hover:text-[#21b4d0]" />
                                                        </Link>
                                                    </div>
                                                    <p className="text-[#7eb6c5] text-xs mt-1 font-medium leading-relaxed">
                                                        ที่อยู่ 111 หมู่ 1 ตำบล แสนสุข<br />
                                                        อำเภอ แสนดี จังหวัดกำลังใจ<br />
                                                        11111
                                                    </p>
                                                    <div className="flex justify-end mt-2">
                                                        <Trash2 size={16} className="text-[#ff5252] cursor-pointer opacity-80 hover:opacity-100" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Location Item 2 */}
                                            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                                                <div className="bg-[#f5fbfe] text-[#7eb6c5] p-2 rounded-full border border-[#eaf6f8] mt-1">
                                                    <MapPin size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-[#455a64] text-base">ที่ทำงาน</span>
                                                        <Link href="/customer/edit-location" onClick={() => setIsLocationOpen(false)}>
                                                            <Pencil size={16} className="text-[#7eb6c5] cursor-pointer hover:text-[#21b4d0]" />
                                                        </Link>
                                                    </div>
                                                    <p className="text-[#7eb6c5] text-xs mt-1 font-medium leading-relaxed">
                                                        ที่อยู่ 114 หมู่ 3 ตำบล แสนสุข<br />
                                                        อำเภอ แสนดี จังหวัดกำลังใจ<br />
                                                        14114
                                                    </p>
                                                    <div className="flex justify-end mt-2">
                                                        <Trash2 size={16} className="text-[#ff5252] cursor-pointer opacity-80 hover:opacity-100" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            href="/customer/add-location"
                                            className="mt-8 bg-[#06B6D4] text-white w-full py-3.5 rounded-2xl text-lg font-bold shadow-[0_10px_20px_rgba(6,182,212,0.2)] hover:bg-[#08a2bc] transition-all text-center block"
                                            onClick={() => setIsLocationOpen(false)}
                                        >
                                            เพิ่มที่อยู่
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>

                        <button className="p-2.5 bg-[#eaf6f8] rounded-xl text-[#21b4d0] hover:bg-[#d1e9ed] transition-colors relative">
                            <ShoppingCart size={24} />
                        </button>
                    </div>

                    <div className="h-10 w-[1px] bg-[#eaf6f8] mx-2"></div>

                    <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#e0e0e0] rounded-2xl font-bold text-[#455a64] shadow-sm hover:bg-gray-50 transition-all">
                        <LogOut size={20} className="rotate-180" />
                        ออกจากระบบ
                    </button>
                </div>
            </nav>
        </div>
    )
}
