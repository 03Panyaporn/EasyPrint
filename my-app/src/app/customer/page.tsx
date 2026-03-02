"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

export default function CustomerHome() {
    const [loadingChat, setLoadingChat] = useState(false)

    const handleStartChat = async () => {
        setLoadingChat(true)
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            // ในระบบจริงต้องมีวิธีหา merchant_id ที่ต้องการคุยด้วย
            // เบื้องต้นขอใช้ค่าคงที่ หรือค้นหาจาก merchant account แรกในระบบ
            // สมมติว่ามี Merchant ID หนึ่งที่คอยดูแลระบบ (เช่น Admin หรือ Shop หลัก)
            // สำหรับการทดสอบนี้ ผมจะใช้วิธีเรียก API ค้นหา merchant หรือแสดง Error ถ้าไม่พบ

            const res = await fetch('http://localhost:3001/api/chat/get-or-create-room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: user.id,
                    merchant_id: 'b9652bb2-cba5-4440-9d89-0f93f598cb67' // ใส่ ID ร้านค้าที่คุณสร้างไว้
                }),
            })
            const roomData = await res.json()
            if (res.ok && roomData.id) {
                window.location.href = `/customer/chat/${roomData.id}`
            } else {
                const errorMsg = roomData.details || roomData.error || "ไม่สามารถเริ่มการสนทนาได้"
                alert(`เกิดข้อผิดพลาด: ${errorMsg}\n\nคำแนะนำ: ${roomData.hint || 'กรุณาตรวจสอบรหัสร้านค้า'}`)
            }
        } catch (error) {
            console.error("Failed to start chat:", error)
            alert("ไม่สามารถเริ่มการสนทนาได้ในขณะนี้")
        } finally {
            setLoadingChat(false)
        }
    }

    return (
        <>
            <section className="relative overflow-hidden bg-white">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#06B6D4]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#06B6D4]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-14 relative">

                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E0F7FA] rounded-full text-[#06B6D4] text-xs font-semibold mb-4">
                            <span className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full animate-pulse" />
                            บริการพิมพ์งานออนไลน์
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-bold leading-[1.2] text-[#455a64] tracking-tight">
                            Print Smarter,
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#0891b2]">
                                Cooler &amp; Faster.
                            </span>
                        </h1>

                        <p className="mt-5 text-lg lg:text-xl text-[#78909c] leading-relaxed max-w-md mx-auto lg:mx-0">
                            ร้านให้บริการถ่ายเอกสาร พิมพ์งาน และเข้าเล่ม พร้อมคำนวณราคาอัตโนมัติอย่างถูกต้องและโปร่งใส
                            รวดเร็ว สะดวก มั่นใจในทุกขั้นตอน พร้อมการแจ้งเตือนสถานะ
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mt-7 justify-center lg:justify-start">
                            <Link
                                href="/customer/order"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#06B6D4] to-[#0891b2] rounded-xl shadow-lg shadow-[#06B6D4]/25 hover:shadow-xl hover:shadow-[#06B6D4]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                เริ่มสั่งพิมพ์
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <button
                                onClick={handleStartChat}
                                disabled={loadingChat}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-[#06B6D4] bg-white border-2 border-[#06B6D4] rounded-xl shadow-sm hover:bg-[#E0F7FA] hover:shadow-md transition-all duration-300"
                            >
                                <MessageSquare size={18} />
                                {loadingChat ? 'กำลังเชื่อมต่อ...' : 'ทักแชทร้านค้า'}
                            </button>
                        </div>
                    </div>

                    {/* Right — Illustration */}
                    <div className="flex-1 flex justify-center">
                        <div className="relative">
                            <div className="w-[320px] h-[360px] lg:w-[400px] lg:h-[440px] bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] rounded-[40px] border-[10px] border-white shadow-2xl shadow-[#06B6D4]/10 flex items-center justify-center overflow-hidden">
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 mx-auto mb-5 bg-white rounded-2xl shadow-lg shadow-[#06B6D4]/20 flex items-center justify-center">
                                        <svg className="w-10 h-10 text-[#06B6D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-bold text-[#455a64] leading-snug">
                                        สะดวก <span className="text-[#06B6D4]">รวดเร็ว</span><br />ทุกที่ ทุกเวลา
                                    </p>
                                    <p className="text-[#90a4ae] text-xs mt-2 leading-relaxed">
                                        บริการพิมพ์งานออนไลน์<br />ครบจบในที่เดียว
                                    </p>
                                    <div className="flex flex-col gap-2 mt-8 items-center">
                                        <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur text-green-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            พร้อมให้บริการ
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur text-amber-500 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                            ⚡ รวดเร็ว ทันใจ
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-5 -right-5 w-24 h-24 bg-[#FFF9C4] rounded-2xl rotate-12 shadow-lg flex items-center justify-center">
                                <svg className="w-10 h-10 text-[#F9A825]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-[#F3E5F5] rounded-2xl -rotate-12 shadow-lg flex items-center justify-center">
                                <svg className="w-9 h-9 text-[#AB47BC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </section>


        </>
    )
}

